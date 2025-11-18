"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const OneTap = () => {
  const router = useRouter();

  useEffect(() => {
    const initializeOneTap = async () => {
      try {
        await authClient.oneTap({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
            onError: (ctx) => {
              console.error("One Tap error:", ctx.error);
            },
          },
        });
      } catch (error) {
        console.error("Failed to initialize One Tap:", error);
      }
    };

    initializeOneTap();
  }, [router]);

  return null;
};
