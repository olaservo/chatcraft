import { ChatCraftProvider, SerializedChatCraftProvider } from "../ChatCraftProvider";
import { ProviderModel } from "../ProviderModel";

export type SerializedCustomProvider = {
  id: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  defaultModel: string;
};

export class CustomProvider extends ChatCraftProvider {
  constructor(name: string, url: string, defaultModel: string, key?: string) {
    super(name, url, defaultModel, key);
  }

  get logoUrl() {
    return "/openai-logo.png";
  }

  // Parse from serialized JSON
  static fromJSON({
    name,
    apiUrl,
    defaultModel,
    apiKey,
  }: SerializedChatCraftProvider): CustomProvider {
    return new CustomProvider(name, apiUrl, defaultModel, apiKey);
  }

  async validateApiKey(key: string) {
    return !!(await this.queryModels(key));
  }

  async queryModels(key: string) {
    if (!this.apiUrl) {
      throw new Error("Missing API Url");
    }

    const { openai } = this.createClient(key);

    try {
      const models = [];
      for await (const page of openai.models.list()) {
        let inputCostPerMillion = 0.0;
        let outputCostPerMillion = 0.0;
        if (page.pricing) {
        }
        models.push(
          new ProviderModel(
            page.id,
            page.created,
            page.owned_by,
            inputCostPerMillion,
            outputCostPerMillion
          )
        );
      }

      const modelList = models.map((model: any) => model.id as string);
      return modelList.sort((a, b) => a.localeCompare(b));
    } catch (err: any) {
      throw new Error(`error querying models API: ${err.message}`);
    }
  }
}
