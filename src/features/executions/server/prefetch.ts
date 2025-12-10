import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getMany>;

/**
 * Prefetch the executions list
 * @param params - The parameters for the query
 */

export const prefetchExecutions = (params: Input) => {
  prefetch(trpc.executions.getMany.queryOptions(params));
};

/**
 * Prefetch the execution by id
 * @param id - The id of the credential
 */
export const prefetchExecution = (id: string) => {
  prefetch(trpc.executions.getOne.queryOptions({ id }));
};
