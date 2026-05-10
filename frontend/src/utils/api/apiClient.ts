interface ApiClientConfigType {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const defaultHeaders = {
  "Content-Type": "application/json",
};

const defaultTimeout = 10000;

export class ApiError<T = unknown> extends Error {
  constructor(
    public status: number,
    public payload?: T,
    public response?: Response
  ) {
    const normalizedMessage = ApiError.resolveMessage(status, payload, response);
    super(normalizedMessage);
    this.name = "ApiError";
    this.message = normalizedMessage;
    this.status = status;
  }

  private static resolveMessage<T>(status: number, payload?: T, response?: Response): string {
    if (typeof payload === "string") {
      const trimmed = payload.trim();
      if (trimmed !== "") {
        return trimmed;
      }
    }

    if (payload && typeof payload === "object") {
      const payloadWithMessage = payload as { message?: unknown };
      if (
        typeof payloadWithMessage.message === "string" &&
        payloadWithMessage.message.trim() !== ""
      ) {
        return payloadWithMessage.message;
      }

      return JSON.stringify(payload);
    }

    return response?.statusText || `Request failed with status ${status}`;
  }
}

export class ApiClient {
  private config: Required<ApiClientConfigType>;
  private includeCredentials = false;

  constructor(config: ApiClientConfigType = {}) {
    this.config = {
      baseURL: config.baseURL ?? "",
      defaultHeaders: config.defaultHeaders ?? defaultHeaders,
      timeout: config.timeout ?? defaultTimeout,
    };
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }

    return `${this.config.baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  }

  private appendQueryParams(endpoint: string, query?: Record<string, unknown>): string {
    if (!query) {
      return endpoint;
    }

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            params.append(key, String(item));
          }
        });
        return;
      }

      params.set(key, String(value));
    });

    const queryString = params.toString();

    if (!queryString) {
      return endpoint;
    }

    return `${endpoint}${endpoint.includes("?") ? "&" : "?"}${queryString}`;
  }

  private buildRequestOptions(options: RequestInit): RequestInit {
    return {
      ...options,
      credentials: options.credentials ?? (this.includeCredentials ? "include" : undefined),
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers,
      },
    };
  }

  CompleteCredentialsForRestrictedRoutes(): this {
    this.includeCredentials = true;
    return this;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        return await response.json();
      } catch {
        throw new ApiError(response.status, "Invalid JSON response", response);
      }
    }

    return (await response.text()) as unknown as T;
  }

  private async doRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestOptions = this.buildRequestOptions(options);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, { ...requestOptions, signal: controller.signal });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseResponse<unknown>(response).catch(() => undefined);
        throw new ApiError(response.status, errorData, response);
      }

      const data = await this.parseResponse<T>(response);

      return { data, status: response.status, message: response.statusText };
    } catch (error) {
      if (error instanceof ApiError && error.name === "AbortError") {
        throw new ApiError(408, "Request timeout");
      }
      throw error;
    }
  }

  async get<T, B extends Record<string, unknown> | undefined = undefined>(
    endpoint: string,
    body?: B,
    options: Omit<RequestInit, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    const endpointWithQuery = this.appendQueryParams(endpoint, body as Record<string, unknown>);

    return this.doRequest<T>(endpointWithQuery, {
      ...options,
      method: "GET",
      body: undefined,
    });
  }

  async post<T, B>(
    endpoint: string,
    body?: B,
    options: Omit<RequestInit, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.doRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T, B>(
    endpoint: string,
    body?: B,
    options: Omit<RequestInit, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.doRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options: Omit<RequestInit, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.doRequest<T>(endpoint, { ...options, method: "DELETE" });
  }
}
