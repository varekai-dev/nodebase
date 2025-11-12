import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

const Page = async () => {
  const users = await prisma.user.findMany();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button variant="destructive">Click me</Button>
      {JSON.stringify(users)}
    </div>
  );
};

export default Page;
