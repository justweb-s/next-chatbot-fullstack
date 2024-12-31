import { AIProvider } from './types';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    maxContextWindow: 16000,
    supportsImages: true,
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        maxTokens: 8000,
        contextWindow: 8000,
        supportedFeatures: ['chat', 'function-calling'],
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        maxTokens: 4000,
        contextWindow: 4000,
        supportedFeatures: ['chat', 'function-calling'],
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        maxTokens: 0,
        contextWindow: 0,
        supportedFeatures: ['image-generation'],
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    maxContextWindow: 100000,
    supportsImages: false,
    models: [
      {
        id: 'claude-2',
        name: 'Claude 2',
        maxTokens: 100000,
        contextWindow: 100000,
        supportedFeatures: ['chat'],
      },
      {
        id: 'claude-instant-1',
        name: 'Claude Instant',
        maxTokens: 100000,
        contextWindow: 100000,
        supportedFeatures: ['chat'],
      },
    ],
  },
  {
    id: 'google',
    name: 'Google AI',
    maxContextWindow: 32000,
    supportsImages: true,
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        maxTokens: 32000,
        contextWindow: 32000,
        supportedFeatures: ['chat', 'function-calling'],
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        maxTokens: 32000,
        contextWindow: 32000,
        supportedFeatures: ['chat', 'image-understanding'],
      },
    ],
  },
];
