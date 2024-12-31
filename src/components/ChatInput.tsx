'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message...'
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 pr-12 rounded-lg border resize-none transition-all duration-200
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
          ${isLoading ? 'opacity-50' : 'opacity-100'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400`}
        rows={1}
        style={{ minHeight: '44px', maxHeight: '200px' }}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className={`absolute right-2 bottom-2 p-2 rounded-full transition-all duration-200
          ${
            message.trim() && !isLoading && !disabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400'
          }`}
      >
        <PaperAirplaneIcon className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
      </button>
    </form>
  );
}
