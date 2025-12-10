"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { type Credential, CredentialType } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {
  useCreateCredential,
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  if (credentials.data.items.length === 0) {
    return <CredentialsEmpty />;
  }

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createCredential = useCreateCredential();
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      onNew={handleCreate}
      disabled={disabled}
      newButtonLabel="New credential"
      isCreating={createCredential.isPending}
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();
  return (
    <EntityPagination
      page={credentials.data.page || 0}
      totalPages={credentials.data.totalPages || 0}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={credentials.isFetching}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };
  return (
    <EmptyView
      message="You haven't created any credentials yet. Get started by creating a new credential."
      onNew={handleCreate}
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "/logos/credential.svg";

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
