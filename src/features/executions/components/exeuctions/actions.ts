"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { executionChannel } from "@/inngest/channels/execution";
import { inngest } from "@/inngest/client";

export type ExecutionStatusToken = Realtime.Token<
  typeof executionChannel,
  ["status"]
>;

export async function fetchExecutionStatusToken(): Promise<ExecutionStatusToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: executionChannel(),
    topics: ["status"],
  });

  return token;
}
