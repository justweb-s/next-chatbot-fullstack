'use client';

import { useState, useEffect } from 'react';
import { AI_PROVIDERS } from '@/lib/ai/providers';
import { AIConfig as AIConfigType } from '@/lib/ai/types';

interface AIConfigProps {
  config: AIConfigType;
  onConfigChange: (config: AIConfigType) => void;
}

export function AIConfig({ config, onConfigChange }: AIConfigProps) {
  const [selectedProvider, setSelectedProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [selectedModel, setSelectedModel] = useState(config.model);
  const [temperature, setTemperature] = useState(config.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(config.maxTokens || 1000);
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt || '');

  const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const models = provider?.models || [];

  // Sync with parent component's config
  useEffect(() => {
    setSelectedProvider(config.provider);
    setSelectedModel(config.model);
    setApiKey(config.apiKey);
    setTemperature(config.temperature || 0.7);
    setMaxTokens(config.maxTokens || 1000);
    setSystemPrompt(config.systemPrompt || '');
  }, [config]);

  // Update parent component when local state changes
  const updateConfig = () => {
    const newConfig: AIConfigType = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey,
      temperature,
      maxTokens,
      systemPrompt,
    };
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">AI Configuration</h3>
      
      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => {
            const newProvider = e.target.value;
            const newProviderModels = AI_PROVIDERS.find(p => p.id === newProvider)?.models || [];
            const defaultModel = newProviderModels[0]?.id || '';
            
            setSelectedProvider(newProvider);
            setSelectedModel(defaultModel);
            
            // Update parent immediately
            onConfigChange({
              ...config,
              provider: newProvider,
              model: defaultModel,
            });
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          {AI_PROVIDERS.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            onConfigChange({
              ...config,
              model: e.target.value,
            });
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* API Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            onConfigChange({
              ...config,
              apiKey: e.target.value,
            });
          }}
          placeholder={`Enter your ${provider?.name} API key`}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temperature: {temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => {
            const newTemp = parseFloat(e.target.value);
            setTemperature(newTemp);
            onConfigChange({
              ...config,
              temperature: newTemp,
            });
          }}
          className="w-full"
        />
      </div>

      {/* Max Tokens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Tokens
        </label>
        <input
          type="number"
          value={maxTokens}
          onChange={(e) => {
            const newTokens = parseInt(e.target.value);
            setMaxTokens(newTokens);
            onConfigChange({
              ...config,
              maxTokens: newTokens,
            });
          }}
          min="1"
          max={provider?.maxContextWindow || 1000}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          System Prompt
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => {
            setSystemPrompt(e.target.value);
            onConfigChange({
              ...config,
              systemPrompt: e.target.value,
            });
          }}
          placeholder="Enter a system prompt to guide the AI's behavior..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 h-24 resize-none"
        />
      </div>

      {/* Provider Info */}
      <div className="text-sm text-gray-500 mt-4">
        <p>Max Context Window: {provider?.maxContextWindow.toLocaleString()} tokens</p>
        <p>Supports Images: {provider?.supportsImages ? 'Yes' : 'No'}</p>
        <p>Available Features: {models.find(m => m.id === selectedModel)?.supportedFeatures.join(', ')}</p>
      </div>
    </div>
  );
}
