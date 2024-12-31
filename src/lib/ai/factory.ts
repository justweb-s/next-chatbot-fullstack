import { AIConfig } from './types';
import { generateOpenAIResponse } from './clients/openai';
import { generateAnthropicResponse } from './clients/anthropic';
import { generateGoogleResponse } from './clients/google';

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  config: AIConfig
) {
  switch (config.provider) {
    case 'openai':
      return generateOpenAIResponse(messages, config);
    case 'anthropic':
      return generateAnthropicResponse(messages, config);
    case 'google':
      return generateGoogleResponse(messages, config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}
