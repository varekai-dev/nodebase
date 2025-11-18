import { OneTap } from "@/features/auth/components/one-tap";
import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <>
      <OneTap />
      <RegisterForm />
    </>
  );
};

export default Page;
