import OpenAI from "openai";

let _openai: OpenAI | null = null;

/**
 * Get the OpenAI client instance.
 * Lazily initialized to avoid errors when OPENAI_API_KEY is not set.
 * Returns null if no API key is configured.
 */
export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return _openai;
}

export default getOpenAIClient;
