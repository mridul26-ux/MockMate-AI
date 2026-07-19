import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = [
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "antigravity-preview-05-2026",
  "deep-research-preview-04-2026",
];

async function testModels() {
  for (const model of models) {
    console.log(`Testing model: ${model}`);
    try {
      const result = await generateObject({
        model: google(model),
        prompt: "Generate a simple user object.",
        schema: z.object({
          name: z.string(),
          age: z.number(),
        }),
      });
      console.log(`SUCCESS with ${model}:`, result.object);
      return;
    } catch (error) {
      console.error(`FAILED with ${model}:`, error.message);
    }
  }
}

testModels();
