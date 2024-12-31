'use client';

import { useState, useEffect } from 'react';

interface Chat {
  id: string;
  modelProvider: string;
  modelName: string;
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

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
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

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
      });
      const newChat = await response.json();
      setChats(prev => [newChat, ...prev]);
      onSelectChat(newChat.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <div className="w-64 border-r border-gray-300 overflow-y-auto">
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
        >
          New Chat
        </button>

        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <div className="space-y-2">
          {chats.map((chat) => {
            const preview = chat.messages && chat.messages.length > 0
              ? chat.messages[0].content.length > 30
                ? chat.messages[0].content.substring(0, 30) + '...'
                : chat.messages[0].content
              : 'New Chat';

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-2 rounded ${
                  selectedChatId === chat.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-sm">{preview}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {chat.modelProvider || 'Not configured'} {chat.modelName ? `- ${chat.modelName}` : ''}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
