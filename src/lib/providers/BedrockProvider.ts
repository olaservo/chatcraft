import { ChatCraftProvider, SerializedChatCraftProvider } from "../ChatCraftProvider";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

export class BedrockProvider extends ChatCraftProvider {
  constructor(name: string, url: string, defaultModel: string, key?: string) {
    super(name, url, defaultModel, key);
  }

  get logoUrl() {
    return "/openai-logo.png"; // TODO: This is a placeholder, the actual URL is not known
  }

  // Parse from serialized JSON
  static fromJSON({ name, defaultModel }: SerializedChatCraftProvider): BedrockProvider {
    return new BedrockProvider(name, "", defaultModel, "");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateApiKey(key: string) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryModels(key: string) {
    // Create a Bedrock Runtime client in the AWS Region you want to use.
    const client = new BedrockClient({ region: "us-west-2" });
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    try {
      const models = [];
      // iterate through models in the response
      for await (const modelSummary of response.modelSummaries || []) {
        models.push(modelSummary);
      }

      const modelList = models.map((model: any) => model.modelId as string);
      return modelList.sort((a, b) => a.localeCompare(b));
    } catch (err: any) {
      throw new Error(`error querying ListFoundationModelsCommand: ${err.message}`);
    }
  }
}
