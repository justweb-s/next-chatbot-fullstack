'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  createdAt: string;
}

interface ChatContainerProps {
  initialChatId?: string | null;
}

export function ChatContainer({ initialChatId }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (initialChatId) {
      setChatId(initialChatId);
      fetchMessages(initialChatId);
    } else {
      createNewChat();
    }
  }, [initialChatId]);

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/chat/${id}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
      });
      const chat = await response.json();
      setChatId(chat.id);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;

    setIsLoading(true);

    try {
      // Save user message
      const userMessageResponse = await fetch(`/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          isUser: true,
        }),
      });
      const userMessage = await userMessageResponse.json();
      setMessages((prev) => [...prev, userMessage]);

      // Generate AI response
      const aiResponse = await fetch(`/api/chat/${chatId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
        }),
      });
      const aiMessage = await aiResponse.json();
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-lg border border-gray-300 bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <p className="text-sm">Sto pensando...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-300 p-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
