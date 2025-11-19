import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";
import { oneTapClient } from "better-auth/client/plugins";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL,
  origin: baseURL!,
  plugins: [
    polarClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    }),
  ],
});
