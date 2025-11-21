// 1. Fetch with client component

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

// 2. Fetch with server component

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

// 3. Fetch with trpc client

// import { getQueryClient, trpc } from "@/trpc/server";
// import { Client } from "./client";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { Suspense } from "react";

// const Page = async () => {
//   const queryClient = getQueryClient();

//   void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center">
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Client />
//         </Suspense>
//       </HydrationBoundary>
//     </div>
//   );
// };

// export default Page;

"use client";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  // const { data } = useQuery(trpc.getWorkflows.queryOptions());

  // const testAi = useMutation(
  //   trpc.testAi.mutationOptions({
  //     onSuccess: () => {
  //       toast.success("Job queued");
  //     },
  //     onError: (error) => {
  //       toast.error("Something went wrong");
  //     },
  //   })
  // );

  // const create = useMutation(
  //   trpc.createWorkflow.mutationOptions({
  //     onSuccess: () => {
  //       toast.success("Job queued");
  //     },
  //   })
  // );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      {/* <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      <Button
        disabled={create.isPending}
        onClick={() => create.mutate({ name: "New Workflow" })}
      >
        Create Workflow
      </Button>
      <LogoutButton /> */}
    </div>
  );
};

export default Page;
