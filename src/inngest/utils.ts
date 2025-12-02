import { NonRetriableError } from "inngest";
import toposort from "toposort";
import type { Connection, Node } from "@/generated/prisma";
import { inngest } from "./client";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // if no connections, return empty array (all nodes are unconnected)
  if (connections.length === 0) {
    return [];
  }

  // Create edges array for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  // Perform topological sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new NonRetriableError("Workflow contains a cyclic dependency");
    }
    throw error;
  }

  // Map sorted node ids back to original nodes, filtering to only include connected nodes
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds
    .map((id) => nodeMap.get(id))
    .filter(
      (node): node is Node =>
        node !== undefined && connectedNodeIds.has(node.id)
    );
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
};
