import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{ workflowsId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { workflowsId } = await params;

  prefetchWorkflow(workflowsId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowsId} />
          <main className="flex-1">
            <Editor workflowId={workflowsId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
