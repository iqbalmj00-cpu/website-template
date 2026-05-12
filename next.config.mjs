/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        // /customer-portal redirects to the dashboard with the siteToken in
        // the query string. This header tells browsers NOT to send a Referer
        // header on the redirect-following request, so the dashboard's logs
        // and any caching layers in between don't capture the previous URL.
        // (Partial mitigation — full fix needs dashboard to switch the auth
        // transport off the URL. See dashboard coordination backlog.)
        source: "/customer-portal",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        source: "/__preview",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/preview",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__preview",
        destination: "/preview",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/get-started",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/legal",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/booking-details",
        destination: "/customer-portal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
