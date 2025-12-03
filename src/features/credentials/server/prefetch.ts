import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetch the credentials list
 * @param params - The parameters for the query
 */

export const prefetchCredentials = (params: Input) => {
  prefetch(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Prefetch the credential by id
 * @param id - The id of the credential
 */
export const prefetchCredential = (id: string) => {
  prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
