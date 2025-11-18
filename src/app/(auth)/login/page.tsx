import { LoginForm } from "@/features/auth/components/login-form";
import { OneTap } from "@/features/auth/components/one-tap";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <>
      <OneTap />
      <LoginForm />
    </>
  );
};

export default Page;
