import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    polarClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    }),
  ],
});
