import { createAuthClient } from "better-auth/react";
import "dotenv/config";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */

  baseURL: "https://pedro-domains.shop",
});
