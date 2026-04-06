import { defineConfig } from "orval";

function getRequiredEnv(name: "API_SCHEMA_URL" | "NEXT_PUBLIC_API_URL"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const apiSchemaUrl = getRequiredEnv("API_SCHEMA_URL");
const apiBaseUrl = getRequiredEnv("NEXT_PUBLIC_API_URL");

export default defineConfig({
  kanbanMetrics: {
    input: {
      target: apiSchemaUrl,
    },
    output: {
      target: "src/generated/orval/runtime-client.ts",
      schemas: {
        path: "src/generated/orval/zod",
        type: "zod",
      },
      client: "fetch",
      mode: "split",
      clean: true,
      baseUrl: apiBaseUrl,
      override: {
        fetch: {
          runtimeValidation: true,
        },
        zod: {
          generate: {
            body: true,
            query: true,
            response: true,
            header: false,
            param: false,
          },
        },
      },
    },
  },
});
