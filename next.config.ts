import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.datocms-assets.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "lgtbhinsdmblkrfuttnz.supabase.co" },
    ],
  },
};

export default nextConfig;
