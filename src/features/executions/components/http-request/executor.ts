import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  variableName?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO Publish 'loading' state for http request

  if (!data.endpoint) {
    // TODO Publish 'error' state for http request
    throw new NonRetriableError("Endpoint is required");
  }

  const result = await step.run("http-request", async () => {
    if (!data.endpoint) {
      throw new NonRetriableError("HTTP Request: No endpoint configured");
    }

    if (!data.variableName) {
      throw new NonRetriableError("HTTP Request: No variable name configured");
    }
    const method = data.method || "GET";
    const endpoint = data.endpoint;

    const options: KyOptions = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (data.body) {
        options.body = data.body;
        options.headers = {
          "Content-Type": "application/json",
        };
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json().catch(() => response.text())
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // TODO Publish 'success' state for http request

  return result;
};
