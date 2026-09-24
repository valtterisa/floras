import { siteConfig } from "@/lib/seo";
import {
  ogContentType,
  ogSize,
  renderOgImage,
} from "@/lib/og/image";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    title: siteConfig.tagline,
    description: siteConfig.description,
  });
}
