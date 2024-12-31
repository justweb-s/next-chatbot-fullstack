'use client';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  imageUrl?: string;
}

export default function ChatMessage({ content, isUser, imageUrl }: ChatMessageProps) {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Generated"
              className="rounded-lg max-w-full h-auto shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
