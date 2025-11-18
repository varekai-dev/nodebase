"use client";

import { authClient } from "@/lib/auth-client";

import { useEffect } from "react";

export const OneTap = () => {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log("Initializing One Tap");
    console.log("Client ID present:", !!clientId);
    
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          console.log("One Tap success");
        },
        onError: (error) => {
          console.error("One Tap error", error);
        },
      },
    });
  }, []);

  return null;
};
