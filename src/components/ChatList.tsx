'use client';

import { useState, useEffect } from 'react';

interface Chat {
  id: string;
  messages: Array<{
    content: string;
    isUser: boolean;
    createdAt: string;
  }>;
  createdAt: string;
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  return (
    <div className="w-64 border-r border-gray-300 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <div className="space-y-2">
          {chats.map((chat) => {
            const firstMessage = chat.messages[0]?.content || 'New Chat';
            const preview = firstMessage.length > 30
              ? firstMessage.substring(0, 30) + '...'
              : firstMessage;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <p className="font-medium text-sm">{preview}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
