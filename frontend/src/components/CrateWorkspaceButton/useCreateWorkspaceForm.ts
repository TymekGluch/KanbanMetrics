import {
  WorkspaceRouterCreateWorkspaceRequest,
  type WorkspaceRouterCreateWorkspaceRequest as WorkspaceRouterCreateWorkspaceRequestType,
} from "@/generated/orval/zod/workspaceRouterCreateWorkspaceRequest.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateWorkspaceMutationFetch } from "./api/useCreateWorkspaceMutationFetch";
import { mapBackendErrorsToForm } from "../Forms/utils/backendFormErrors";

const GLOBAL_SERVER_FIELD = "root.server" as const;

const fieldNameMap = {
  name: "name",
  global: GLOBAL_SERVER_FIELD,
} as const;

export function useCreateWorkspaceForm(onOpenChange: (open: boolean) => void) {
  const createMutation = useCreateWorkspaceMutationFetch();

  const form = useForm<WorkspaceRouterCreateWorkspaceRequestType>({
    resolver: zodResolver(WorkspaceRouterCreateWorkspaceRequest),
  });

  const handleSubmit = form.handleSubmit(
    async (data: WorkspaceRouterCreateWorkspaceRequestType) => {
      try {
        await createMutation.mutateAsync(data, {
          onSuccess: () => {
            onOpenChange(false);
          },
        });

        return;
      } catch (error) {
        mapBackendErrorsToForm<WorkspaceRouterCreateWorkspaceRequestType>({
          error,
          fallbackField: GLOBAL_SERVER_FIELD,
          fieldNameMap,
          setError: form.setError,
        });
      }
    }
  );

  return {
    form,
    handleSubmit,
    isPending: createMutation.isPending,
    isError: createMutation.isError,
  };
}
