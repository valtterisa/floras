import { NextRequest, NextResponse } from "next/server";

const getTargetUrl = (id: string | string[], request: NextRequest) => {
  let appName = "";
  let subPath = "";
  if (Array.isArray(id)) {
    appName = id[0];
    subPath = id.slice(1).join("/");
  } else {
    appName = id;
    subPath = "";
  }
  const url = new URL(request.url);
  const query = url.search ? url.search : "";
  return `https://${appName}.fly.dev/${subPath}${query}`;
};

async function waitForOkResponse(
  target: string,
  request: NextRequest,
  timeoutMs = 30000,
  pollIntervalMs = 1500
) {
  const start = Date.now();
  let lastStatus = 0;
  let lastError = null;
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(target, {
        method: "GET",
        headers: request.headers,
        redirect: "manual",
      });
      lastStatus = response.status;
      if (response.status === 200) {
        return response;
      }
    } catch (err) {
      lastError = err;
    }
    await new Promise((res) => setTimeout(res, pollIntervalMs));
  }
  return { status: lastStatus, error: lastError };
}

export async function GET(
  request: NextRequest,
  ctx: { params: { id: string | string[] } }
) {
  const params = await ctx.params;
  const target = getTargetUrl(params.id, request);

  try {
    const response = await waitForOkResponse(target, request);
    if (response instanceof Response) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        let html = await response.text();
        const appName = Array.isArray(params.id) ? params.id[0] : params.id;
        html = html.replace(
          /\/(_next)\/static\//g,
          `/api/preview/${appName}/_next/static/`
        );
        const resHeaders = new Headers(response.headers);
        resHeaders.delete("content-encoding");
        resHeaders.delete("content-length");
        resHeaders.delete("transfer-encoding");
        return new NextResponse(html, {
          status: response.status,
          headers: resHeaders,
        });
      }
      // For non-HTML, just stream as-is
      const resHeaders = new Headers(response.headers);
      const urlPath = Array.isArray(params.id)
        ? params.id.join("/")
        : params.id;
      if (!urlPath.match(/\.(woff2?|ttf|otf|eot)$/i)) {
        resHeaders.delete("content-encoding");
      }
      resHeaders.delete("transfer-encoding");
      return new NextResponse(response.body, {
        status: response.status,
        headers: resHeaders,
      });
    } else {
      // Timed out waiting for 200 OK
      return NextResponse.json(
        {
          error: "Upstream not ready",
          status: response.status,
          details: response.error?.toString(),
        },
        { status: 202 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
