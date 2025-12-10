import { channel, topic } from "@inngest/realtime";
import type { ExecutionStatus } from "@/generated/prisma";

export const EXECUTION_CHANNEL_NAME = "execution-status";

export const executionChannel = channel(EXECUTION_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: ExecutionStatus;
  }>()
);
