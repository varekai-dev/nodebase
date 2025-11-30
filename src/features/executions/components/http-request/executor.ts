import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  variableName?: string;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  if (!data.endpoint) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("HTTP Request: No endpoint configured");
  }

  if (!data.variableName) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("HTTP Request: No variable name configured");
  }

  if (!data.method) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("HTTP Request: No method configured");
  }

  try {
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

      return {
        ...context,
        [data.variableName as string]: responsePayload,
      };
    });

    await publish(httpRequestChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
