import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch the workflows list
 * @param params - The parameters for the query
 */

export const prefetchWorkflows = (params: Input) => {
  prefetch(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Prefetch the workflow by id
 * @param id - The id of the workflow
 */
export const prefetchWorkflow = (id: string) => {
  prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
