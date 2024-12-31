'use client';

import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatList from '@/components/ChatList';

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <ChatList 
        onSelectChat={setSelectedChatId} 
        selectedChatId={selectedChatId} 
      />
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Chatbot</h1>
        <div className="flex justify-center">
          <ChatContainer 
            chatId={selectedChatId || undefined}
          />
        </div>
      </div>
    </main>
  );
}
