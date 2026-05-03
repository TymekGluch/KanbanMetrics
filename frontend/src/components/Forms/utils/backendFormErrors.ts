import { type ApiError } from "@/api/apiClient";
import { type FieldPath, type FieldValues, type UseFormSetError } from "react-hook-form";

export type BackendFieldError = {
  field?: string;
  message?: string;
};

export type BackendErrorPayload = {
  fields?: BackendFieldError[];
  message?: string;
};

type FormErrorPath<TFieldValues extends FieldValues> =
  | FieldPath<TFieldValues>
  | "root"
  | `root.${string}`;

type MapBackendErrorsParams<TFieldValues extends FieldValues> = {
  error: unknown;
  fallbackField: FormErrorPath<TFieldValues>;
  fieldNameMap: Record<string, FormErrorPath<TFieldValues>>;
  setError: UseFormSetError<TFieldValues>;
};

function isBackendErrorPayload(payload: unknown): payload is BackendErrorPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return "fields" in payload || "message" in payload;
}

export function extractBackendErrorPayload(error: unknown): BackendErrorPayload | undefined {
  const apiError = error as ApiError | undefined;

  if (apiError?.payload && isBackendErrorPayload(apiError.payload)) {
    return apiError.payload;
  }

  if (!(error instanceof Error)) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(error.message) as unknown;
    if (isBackendErrorPayload(parsed)) {
      return parsed;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function mapBackendErrorsToForm<TFieldValues extends FieldValues>({
  error,
  fallbackField,
  fieldNameMap,
  setError,
}: MapBackendErrorsParams<TFieldValues>) {
  const payload = extractBackendErrorPayload(error);
  const fieldErrors = payload?.fields;
  let hasMappedError = false;

  if (fieldErrors && fieldErrors.length > 0) {
    for (const fieldError of fieldErrors) {
      if (!fieldError.field || !fieldError.message) {
        continue;
      }

      const formField = fieldNameMap[fieldError.field];
      if (!formField) {
        continue;
      }

      setError(formField, {
        type: "server",
        message: fieldError.message,
      });

      hasMappedError = true;
    }

    if (hasMappedError) {
      return;
    }
  }

  const rawFallbackMessage =
    payload?.message ?? (error instanceof Error ? error.message : undefined);
  const fallbackMessage =
    rawFallbackMessage && rawFallbackMessage !== "null" && rawFallbackMessage !== "undefined"
      ? rawFallbackMessage
      : "Request failed";

  setError(fallbackField, {
    type: "server",
    message: fallbackMessage,
  });
}
