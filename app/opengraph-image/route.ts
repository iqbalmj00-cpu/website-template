import { siteConfig } from "@/lib/siteConfig";
import { canExposePublicSite } from "@/lib/publicSiteGuard";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function GET() {
    const publicSiteReady = canExposePublicSite();
    const title = escapeXml(publicSiteReady ? siteConfig.companyName : "Website Setup Required");
    const subtitle = escapeXml(publicSiteReady ? `Junk removal in ${siteConfig.city}` : "Public website not ready");
    const serviceArea = escapeXml(publicSiteReady ? siteConfig.serviceArea || siteConfig.tagline : "Indexing disabled");
    const brand = escapeXml(publicSiteReady ? siteConfig.brandColor : "#374151");

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
