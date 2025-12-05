import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type SlackData = {
  webhookUrl?: string;
  content?: string;
  variableName?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(slackChannel().status({ nodeId, status: "loading" }));

  if (!data.content) {
    await publish(slackChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Slack: No content configured");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Slack: No webhook URL configured");
      }
      await ky.post(data.webhookUrl, {
        json: {
          content: content, // The key depends on workflow config
        },
      });

      if (!data.variableName) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Slack: No variable name configured");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content,
        },
      };
    });

    await publish(slackChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(slackChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
