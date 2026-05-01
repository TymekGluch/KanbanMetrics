import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CURLY_BRACES_PATTERN = /[{}]/g;
const NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]+/g;
const CONSECUTIVE_WHITESPACE_PATTERN = /\s+/;
const NUMERIC_STATUS_CODE_PATTERN = /^\d+$/;

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head", "trace"] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

const SUCCESS_HTTP_STATUS_RANGE_START = 200;
const SUCCESS_HTTP_STATUS_RANGE_END = 299;

const OUTPUT_FILE_PATH = "src/generated/api-aliases.ts";

type OpenAPIContentMap = Record<string, unknown>;

type OpenAPIRequestBody = {
  content?: OpenAPIContentMap;
};

type OpenAPIResponse = {
  content?: OpenAPIContentMap;
};

type OpenAPIOperation = {
  requestBody?: OpenAPIRequestBody;
  responses?: Record<string, OpenAPIResponse | undefined>;
};

type OpenAPIPathItem = Partial<Record<HttpMethod, OpenAPIOperation | undefined>>;

type OpenAPISpec = {
  paths?: Record<string, OpenAPIPathItem | undefined>;
  components?: {
    schemas?: Record<string, unknown>;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function toPascalCase(value: string): string {
  return value
    .replace(CURLY_BRACES_PATTERN, "")
    .replace(NON_ALPHANUMERIC_PATTERN, " ")
    .trim()
    .split(CONSECUTIVE_WHITESPACE_PATTERN)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function buildOperationName(method: HttpMethod, routePath: string): string {
  const routeInPascalCase = routePath.split("/").filter(Boolean).map(toPascalCase).join("");
  return `${toPascalCase(method)}${routeInPascalCase}`;
}

function buildContentTypeSuffix(contentType: string): string {
  return toPascalCase(contentType);
}

function buildSchemaAliasName(schemaName: string): string {
  return schemaName.split(".").map(toPascalCase).join("");
}

function isSuccessStatusCode(statusCode: string): boolean {
  const numericCode = parseInt(statusCode, 10);
  return (
    numericCode >= SUCCESS_HTTP_STATUS_RANGE_START && numericCode <= SUCCESS_HTTP_STATUS_RANGE_END
  );
}

function formatStatusCodeAsIndex(statusCode: string): string {
  return NUMERIC_STATUS_CODE_PATTERN.test(statusCode) ? statusCode : JSON.stringify(statusCode);
}

function generateFileHeader(): string[] {
  return [
    'import type { components, paths } from "./api-types";',
    "",
    "export type ApiPaths = paths;",
    'export type ApiSchemas = components["schemas"];',
    "export type ApiPathKey = keyof ApiPaths;",
    'export type ApiMethod<P extends ApiPathKey> = Exclude<keyof ApiPaths[P], "parameters">;',
    "export type ApiOperation<P extends ApiPathKey, M extends ApiMethod<P>> = NonNullable<ApiPaths[P][M]>;",
    "",
  ];
}

function generateSchemaAliases(schemas: Record<string, unknown>): string[] {
  const aliases = Object.keys(schemas)
    .sort()
    .map((schemaName) => {
      const aliasName = buildSchemaAliasName(schemaName);
      return `export type ${aliasName} = ApiSchemas[${JSON.stringify(schemaName)}];`;
    });

  return aliases.length > 0 ? [...aliases, ""] : [];
}

function generateRequestBodyAliases(
  operationName: string,
  routePath: string,
  method: HttpMethod,
  requestBody: OpenAPIRequestBody
): string[] {
  const contentTypes = Object.keys(requestBody.content ?? {}).sort();
  if (contentTypes.length === 0) return [];

  const isSoleContentType = contentTypes.length === 1;

  return contentTypes.map((contentType) => {
    const nameSuffix = isSoleContentType ? "" : buildContentTypeSuffix(contentType);
    return `export type ${operationName}RequestBody${nameSuffix} = ApiPaths[${JSON.stringify(routePath)}][${JSON.stringify(method)}]["requestBody"]["content"][${JSON.stringify(contentType)}];`;
  });
}

function generateResponseAliasesForStatus(
  operationName: string,
  routePath: string,
  method: HttpMethod,
  statusCode: string,
  responseSpec: OpenAPIResponse,
  includeSuccessAlias: boolean
): string[] {
  const contentTypes = Object.keys(responseSpec.content ?? {}).sort();
  if (contentTypes.length === 0) return [];

  const isSoleContentType = contentTypes.length === 1;
  const primaryContentType = contentTypes[0];

  const statusIndex = formatStatusCodeAsIndex(statusCode);

  const responseAliases = contentTypes.map((contentType) => {
    const nameSuffix = isSoleContentType ? "" : buildContentTypeSuffix(contentType);
    return `export type ${operationName}Response${statusCode}${nameSuffix} = ApiPaths[${JSON.stringify(routePath)}][${JSON.stringify(method)}]["responses"][${statusIndex}]["content"][${JSON.stringify(contentType)}];`;
  });

  if (!includeSuccessAlias) return responseAliases;

  const primaryAliasSuffix = isSoleContentType ? "" : buildContentTypeSuffix(primaryContentType);
  const successAlias = `export type ${operationName}SuccessResponse = ${operationName}Response${statusCode}${primaryAliasSuffix};`;

  return [...responseAliases, successAlias];
}

function generateOperationAliases(
  routePath: string,
  method: HttpMethod,
  operation: OpenAPIOperation
): string[] {
  const operationName = buildOperationName(method, routePath);

  const requestBodyAliases = operation.requestBody
    ? generateRequestBodyAliases(operationName, routePath, method, operation.requestBody)
    : [];

  const sortedResponseStatuses = Object.keys(operation.responses ?? {}).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const firstSuccessStatus = sortedResponseStatuses.find(
    (statusCode) =>
      isSuccessStatusCode(statusCode) &&
      Object.keys(operation.responses?.[statusCode]?.content ?? {}).length > 0
  );

  const responseAliases = sortedResponseStatuses.flatMap((statusCode) => {
    const responseSpec = operation.responses?.[statusCode];
    if (!responseSpec) return [];

    return generateResponseAliasesForStatus(
      operationName,
      routePath,
      method,
      statusCode,
      responseSpec,
      statusCode === firstSuccessStatus
    );
  });

  const allAliases = [...requestBodyAliases, ...responseAliases];
  return allAliases.length > 0 ? [...allAliases, ""] : [];
}

function generatePathAliases(paths: Record<string, OpenAPIPathItem | undefined>): string[] {
  return Object.entries(paths)
    .sort(([routePathA], [routePathB]) => routePathA.localeCompare(routePathB))
    .flatMap(([routePath, pathItem]) => {
      if (!pathItem) return [];

      return HTTP_METHODS.flatMap((method) => {
        const operation = pathItem[method];
        if (!operation) return [];

        return generateOperationAliases(routePath, method, operation);
      });
    });
}

async function main(): Promise<void> {
  const apiSchemaUrl = requireEnv("API_SCHEMA_URL");
  const fetchResponse = await fetch(apiSchemaUrl);

  if (!fetchResponse.ok) {
    throw new Error(
      `Failed to fetch OpenAPI schema from ${apiSchemaUrl}: ${fetchResponse.status} ${fetchResponse.statusText}`
    );
  }

  const spec = (await fetchResponse.json()) as OpenAPISpec;

  const fileHeader = generateFileHeader();
  const schemaAliases = generateSchemaAliases(spec.components?.schemas ?? {});
  const pathAliases = generatePathAliases(spec.paths ?? {});

  const allLines = [...fileHeader, ...schemaAliases, ...pathAliases];
  const output = `${allLines.join("\n").trim()}\n`;

  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE_PATH);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.warn(
    `Generated ${pathAliases.filter((line) => line.startsWith("export type")).length} type aliases to ${outputPath}`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
