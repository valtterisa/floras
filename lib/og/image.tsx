import { ImageResponse } from "next/og";
import { loadOgAssets } from "@/lib/og/assets";
import { siteConfig } from "@/lib/seo";

export const ogSize = {
  width: 1200,
  height: 630,
} as const;

export const ogContentType = "image/png";

type OgImageProps = {
  title: string;
  description?: string;
};

function titleFontSize(title: string): number {
  if (title.length > 72) return 44;
  if (title.length > 48) return 52;
  if (title.length > 28) return 60;
  return 68;
}

function clampWords(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxChars * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[.,;:—–-]+\s*$/, "")}…`;
}

function wordNodes(text: string) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => (
      <div key={`${i}-${word}`} style={{ display: "flex", marginRight: 8 }}>
        {word}
      </div>
    ));
}

export async function renderOgImage({
  title,
  description,
}: OgImageProps): Promise<ImageResponse> {
  const { logoSrc, fontSemiBold, fontRegular } = await loadOgAssets();
  const safeTitle = title?.trim() || siteConfig.tagline;
  const size = titleFontSize(safeTitle);
  const desc = description?.trim()
    ? clampWords(description.trim(), 180)
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2f6fa",
          color: "#0d0f14",
          fontFamily: "Geist",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <img
            src={logoSrc}
            width={44}
            height={44}
            alt=""
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              width: 1040,
              fontSize: size,
              fontWeight: 600,
              color: "#0d0f14",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
            }}
          >
            {wordNodes(safeTitle)}
          </div>
          <div
            style={{
              display: "flex",
              width: 180,
              height: 10,
              background: "#c028f0",
              marginTop: 18,
            }}
          />

          {desc ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                width: 920,
                fontSize: 24,
                fontWeight: 400,
                color: "#545864",
                lineHeight: 1.45,
                marginTop: 28,
              }}
            >
              {wordNodes(desc)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Geist",
          data: fontSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Geist",
          data: fontRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
