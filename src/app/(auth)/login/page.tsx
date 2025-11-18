import { LoginForm } from "@/features/auth/components/login-form";
import { authClient } from "@/lib/auth-client";
import { requireUnauth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

const Page = async () => {
  await requireUnauth();
  await authClient.oneTap({
    fetchOptions: {
      onSuccess: () => {
        // For example, use a router to navigate without a full reload:
        redirect("/");
      },
    },
  });
  return <LoginForm />;
};

export default Page;
