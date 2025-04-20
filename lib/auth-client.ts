import { createAuthClient } from "better-auth/react";
import "dotenv/config";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */

  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  fetchOptions: {
    credentials: "include",
    // <-- isso aqui precisa estar!
  },
});
