import { AuthLayout } from "@/features/auth/components/auth-layout";
import { OneTap } from "@/features/auth/components/one-tap";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OneTap />
      <AuthLayout>{children}</AuthLayout>
    </>
  );
};

export default Layout;
