import OpenAI from 'openai';
import { AIConfig } from '../types';

export async function generateOpenAIResponse(
  messages: { role: string; content: string }[],
  config: AIConfig
) {
  const openai = new OpenAI({
    apiKey: config.apiKey,
  });

  try {
    if (config.model === 'dall-e-3') {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: messages[messages.length - 1].content,
        n: 1,
        size: '1024x1024',
      });

      return {
        content: 'Image generated successfully',
        imageUrl: response.data[0].url,
      };
    } else {
      const completion = await openai.chat.completions.create({
        messages,
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      return {
        content: completion.choices[0]?.message?.content || 'No response generated',
        imageUrl: null,
      };
    }
  } catch (error: any) {
    throw new Error(`OpenAI Error: ${error.message}`);
  }
}
