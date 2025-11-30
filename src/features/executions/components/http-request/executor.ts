import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

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
    throw new NonRetriableError("HTTP Request: No endpoint configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError("HTTP Request: No variable name configured");
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP Request: No method configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";
    const endpoint = Handlebars.compile(data.endpoint)(context);

    const options: KyOptions = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved);

      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
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

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    return {
      ...context,
      ...responsePayload,
    };
  });

  // TODO Publish 'success' state for http request

  return result;
};
