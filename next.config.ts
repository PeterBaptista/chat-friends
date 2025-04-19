import type { NextConfig } from "next";
import { REDIRECT_DEFAULT_AUTHENTICATED_ROUTE } from "./config/routes";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: REDIRECT_DEFAULT_AUTHENTICATED_ROUTE,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
