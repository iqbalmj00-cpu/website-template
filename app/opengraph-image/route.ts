import { siteConfig } from "@/lib/siteConfig";

export const runtime = "edge";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function GET() {
    const title = escapeXml(siteConfig.companyName);
    const subtitle = escapeXml(`Junk removal in ${siteConfig.city}`);
    const serviceArea = escapeXml(siteConfig.serviceArea || siteConfig.tagline);
    const brand = escapeXml(siteConfig.brandColor);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#111827"/>
  <rect x="72" y="86" width="160" height="18" rx="9" fill="${brand}"/>
  <text x="72" y="260" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="800">${title}</text>
  <text x="72" y="340" fill="#d1d5db" font-family="Arial, Helvetica, sans-serif" font-size="34">${subtitle}</text>
  <text x="72" y="430" fill="#f3f4f6" font-family="Arial, Helvetica, sans-serif" font-size="24">${serviceArea}</text>
</svg>`;

    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400, immutable",
        },
    });
}
