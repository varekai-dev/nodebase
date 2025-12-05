"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchDiscordRealtimeToken } from "./actions";
import { DiscordDialog, type DiscordFormValues } from "./dialog";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<SlackNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleSubmit = (values: DiscordFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          : node
      )
    );
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/discord.svg"
        name="Discord"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
