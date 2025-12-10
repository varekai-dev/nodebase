"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { type Execution, ExecutionStatus } from "@/generated/prisma";
import {
  EXECUTION_CHANNEL_NAME,
  executionChannel,
} from "@/inngest/channels/execution";
import { useSuspenseExecutions } from "../../hooks/use-executions";
import { useExecutionsParams } from "../../hooks/use-executions-params";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchExecutionStatusToken } from "./actions";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View and manage your executions"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();
  return (
    <EntityPagination
      page={executions.data.page || 0}
      totalPages={executions.data.totalPages || 0}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={executions.isFetching}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmpty = () => {
  return <EmptyView message="You don't have any executions yet." />;
};

const getStatusIconByExecution = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;

    case ExecutionStatus.RUNNING:
      return <LoaderCircleIcon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <LoaderCircleIcon className="size-5 text-blue-600 animate-spin" />;
  }
};

const getStatusIconByNodeStatus = (status: NodeStatus) => {
  switch (status) {
    case "success":
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case "error":
      return <XCircleIcon className="size-5 text-red-600" />;

    case "loading":
      return <LoaderCircleIcon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <LoaderCircleIcon className="size-5 text-blue-600 animate-spin" />;
  }
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const nodeStatus = useNodeStatus({
    nodeId: data.inngestEventId,
    channel: EXECUTION_CHANNEL_NAME,
    topic: executionChannel().topics.status.name,
    refreshToken: fetchExecutionStatusToken,
  });

  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const status = nodeStatus === "initial" ? data.status : nodeStatus;

  const icon =
    nodeStatus === "initial"
      ? getStatusIconByExecution(data.status)
      : getStatusIconByNodeStatus(nodeStatus);
  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration && <> &bull; Took {duration} s</>}
    </>
  );
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formatStatus(status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">{icon}</div>
      }
    />
  );
};
