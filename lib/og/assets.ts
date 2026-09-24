import { readFile } from "node:fs/promises";
import { join } from "node:path";

const GEIST_SEMI_BOLD =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@5.2.5/latin-600-normal.woff";
const GEIST_REGULAR =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@5.2.5/latin-400-normal.woff";

export type OgAssets = {
  logoSrc: string;
  fontSemiBold: ArrayBuffer;
  fontRegular: ArrayBuffer;
};

export async function loadOgAssets(): Promise<OgAssets> {
  const [logo, fontSemiBold, fontRegular] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-mark-256.png")),
    fetch(GEIST_SEMI_BOLD).then((res) => {
      if (!res.ok) throw new Error(`Failed to load OG font: ${res.status}`);
      return res.arrayBuffer();
    }),
    fetch(GEIST_REGULAR).then((res) => {
      if (!res.ok) throw new Error(`Failed to load OG font: ${res.status}`);
      return res.arrayBuffer();
    }),
  ]);

  return {
    logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
    fontSemiBold,
    fontRegular,
  };
}
