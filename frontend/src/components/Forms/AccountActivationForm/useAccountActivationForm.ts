import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveAccountFetch } from "./api/useActiveAccountFetch";
import { useForm } from "react-hook-form";
import { AccountActivationAccountActivationInput } from "./AccountActivationForm.validation";
import type { z } from "zod";
import { mapBackendErrorsToForm } from "../utils/backendFormErrors";

const GLOBAL_SERVER_FIELD = "root.server" as const;

const fieldNameMap = {
  code: "code",
  global: GLOBAL_SERVER_FIELD,
} as const;

interface UseAccountActivationFormOptions {
  onSettled?: () => void;
}

export function useAccountActivationForm(options?: UseAccountActivationFormOptions) {
  const activationCodeActivateMutation = useActiveAccountFetch();

  const form = useForm({
    resolver: zodResolver(AccountActivationAccountActivationInput),
  });

  const handleSubmit = form.handleSubmit(
    async (data: z.infer<typeof AccountActivationAccountActivationInput>) => {
      try {
        await activationCodeActivateMutation.mutateAsync(data);
      } catch (error) {
        mapBackendErrorsToForm<z.infer<typeof AccountActivationAccountActivationInput>>({
          error,
          fallbackField: GLOBAL_SERVER_FIELD,
          fieldNameMap,
          setError: form.setError,
        });
      } finally {
        options?.onSettled?.();
      }
    }
  );

  return {
    form,
    handleSubmit,
    isPending: activationCodeActivateMutation.isPending,
  };
}
