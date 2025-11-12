// Fetch with client component

// "use client";

// import { Button } from "@/components/ui/button";
// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// const Page = () => {
//   const trpc = useTRPC();

//   const { data: users } = useQuery(trpc.getUsers.queryOptions());

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center">
//       <Button variant="destructive">Click me</Button>
//       {JSON.stringify(users)}
//     </div>
//   );
// };

// export default Page;

// Fetch with server component

// import { Button } from "@/components/ui/button";
// import { caller } from "@/trpc/server";

// const Page = async () => {
//   const users = await caller.getUsers();

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center">
//       <Button variant="destructive">Click me</Button>
//       {JSON.stringify(users)}
//     </div>
//   );
// };

// export default Page;

// Fetch with trpc client

import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
