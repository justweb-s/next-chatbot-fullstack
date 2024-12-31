import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIConfig } from '../types';

export async function generateGoogleResponse(
  messages: { role: string; content: string }[],
  config: AIConfig
) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.model });

  try {
    const chat = model.startChat({
      history: messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;

    return {
      content: response.text(),
      imageUrl: null,
    };
  } catch (error: any) {
    throw new Error(`Google AI Error: ${error.message}`);
  }
}
