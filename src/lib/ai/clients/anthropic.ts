import Anthropic from '@anthropic-ai/sdk';
import { AIConfig } from '../types';

export async function generateAnthropicResponse(
  messages: { role: string; content: string }[],
  config: AIConfig
) {
  const anthropic = new Anthropic({
    apiKey: config.apiKey,
  });

  try {
    // Convert messages to Anthropic format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: systemPrompt,
      messages: userMessages,
    });

    return {
      content: response.content[0].text,
      imageUrl: null,
    };
  } catch (error: any) {
    throw new Error(`Anthropic Error: ${error.message}`);
  }
}
