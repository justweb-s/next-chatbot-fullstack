export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  maxContextWindow: number;
  supportsImages: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  contextWindow: number;
  supportedFeatures: string[];
}

export interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}
