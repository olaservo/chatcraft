import { ChatCraftProvider } from "../ChatCraftProvider";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import { fromIni } from "@aws-sdk/credential-provider-ini";

export class BedrockProvider extends ChatCraftProvider {
  constructor() {
    super("Bedrock", "mock_url", "auto", "mock_key");
  }

  get logoUrl() {
    return "/openai-logo.png"; // TODO: This is a placeholder, the actual URL is not known
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateApiKey(key: string) {
    return true; // TODO: API key is not applicable here
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryModels(key: string) {
    // Create a Bedrock Runtime client in the AWS Region you want to use.
    const region = "us-west-2";
    const profileName = "nordstrom-federated";
    const client = new BedrockClient({
      region: region,
      credentials: fromIni({ profile: profileName }),
    });
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
