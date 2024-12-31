'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { AIConfig } from './AIConfig';
import { AIConfig as AIConfigType } from '@/lib/ai/types';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  role: 'user' | 'assistant' | 'system';
  imageUrl?: string;
  createdAt?: string;
}

export default function ChatContainer({ chatId }: { chatId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiConfig, setAIConfig] = useState<AIConfigType>({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful assistant.'
  });

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
      setError(null);
    }
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/chat/${chatId}/messages`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error.message || 'Failed to fetch messages');
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !aiConfig.apiKey || !chatId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const tempMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        role: 'user'
      };
      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();

      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          config: aiConfig
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length !== 2) {
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev.slice(0, -1), ...data]);
      scrollToBottom();
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConfig = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="relative">
        <button
          onClick={toggleConfig}
          className="absolute right-4 -bottom-8 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
          aria-label={showConfig ? 'Hide settings' : 'Show settings'}
        >
          {showConfig ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showConfig ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="p-4 bg-white border-b shadow-sm">
            <AIConfig config={aiConfig} onConfigChange={setAIConfig} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}
        {messages.length === 0 && !error && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Start a conversation...
          </div>
        )}
        {Array.isArray(messages) && messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            imageUrl={message.imageUrl}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 bg-white border-t shadow-sm">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!aiConfig.apiKey || !chatId || isLoading}
          placeholder={
            !chatId 
              ? 'Select or create a chat...' 
              : !aiConfig.apiKey 
                ? 'Please enter your API key above...' 
                : isLoading 
                  ? 'Generating response...' 
                  : 'Type a message...'
          }
        />
      </div>
    </div>
  );
}
