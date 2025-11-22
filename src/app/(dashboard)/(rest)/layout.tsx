import { AppHeader } from "@/components/app-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="h-full">{children}</main>
    </>
  );
};

export default Layout;
