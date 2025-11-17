interface PageProps {
  params: Promise<{ workflowsId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { workflowsId } = await params;
  return <p>Workflows ID: {workflowsId}</p>;
};

export default Page;
