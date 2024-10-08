import { describe, test, expect, vi } from "vitest";
import { calculateTokenCost } from "./ai";
import { ChatCraftModel } from "./ChatCraftModel";

vi.mock("./settings");

describe("ai module", () => {
  test("calculateTokenCost() should return the correct cost for a known GPT model", () => {
    const model = new ChatCraftModel("gpt-3.5-turbo");
    const cost = calculateTokenCost(1000, model);
    expect(cost).toBe(0.002);
  });

  test("calculateTokenCost() should return the correct cost for a model from provider_model_details.json", () => {
    const model = new ChatCraftModel("anthropic.claude-instant-v1");
    const cost = calculateTokenCost(1000, model);
    expect(cost).toBe(0.0008);
  });

  test("calculateTokenCost() should return 0 for an unknown model", () => {
    const model = new ChatCraftModel("unknown-model");
    const cost = calculateTokenCost(1000, model);
    expect(cost).toBe(0);
  });
});
