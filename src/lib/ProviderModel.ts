export class ProviderModel {
  id: string;
  created: number;
  object: "model";
  owned_by: string;
  inputCostPerMillion: number;
  outputCostPerMillion: number;

  constructor(
    id: string,
    created: number,
    owned_by: string,
    inputCostPerMillion: number,
    outputCostPerMillion: number
  ) {
    this.id = id;
    this.created = created;
    this.object = "model";
    this.owned_by = owned_by;
    this.inputCostPerMillion = inputCostPerMillion;
    this.outputCostPerMillion = outputCostPerMillion;
  }
}
