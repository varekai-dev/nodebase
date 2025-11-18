"use client";

import { authClient } from "@/lib/auth-client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const OneTap = () => {
  const router = useRouter();
  useEffect(() => {
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          console.error("One Tap error", error);
        },
      },
    });
  }, []);

  return null;
};
