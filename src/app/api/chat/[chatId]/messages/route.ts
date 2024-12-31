import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  isUser: boolean;
}

// GET /api/chat/[chatId]/messages - Get all messages for a chat
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    // Verify chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: params.chatId },
    });

    if (!chat) {
      console.error('Chat not found:', params.chatId);
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: params.chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Retrieved ${messages.length} messages for chat ${params.chatId}`);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[chatId]/messages - Create a new message
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { content, config } = await request.json();
    console.log('Creating message:', { chatId: params.chatId, content, config });

    // Verify chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: params.chatId },
    });

    if (!chat) {
      console.error('Chat not found:', params.chatId);
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Get existing messages
    const existingMessages = await prisma.message.findMany({
      where: {
        chatId: params.chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${existingMessages.length} existing messages`);

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content,
        isUser: true,
        role: 'user',
        chatId: params.chatId,
      },
    });

    console.log('Created user message:', userMessage);

    // Update chat settings if provided
    if (config.provider && config.model) {
      const updatedChat = await prisma.chat.update({
        where: { id: params.chatId },
        data: {
          modelProvider: config.provider,
          modelName: config.model,
          updatedAt: new Date(),
        },
      });
      console.log('Updated chat settings:', updatedChat);
    }

    // Prepare messages for AI
    const messagesForAI: Message[] = [
      { role: 'system', content: config.systemPrompt || '', isUser: false },
      ...existingMessages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.content,
        isUser: m.isUser,
      })),
      { role: 'user', content, isUser: true },
    ];

    // Generate AI response
    console.log('Generating AI response...');
    const generateResponse = await fetch(`${request.url.split('/messages')[0]}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messagesForAI,
        config,
      }),
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      console.error('Error generating AI response:', errorData);
      throw new Error(errorData.error || 'Failed to generate AI response');
    }

    const aiResponse = await generateResponse.json();
    console.log('Received AI response:', aiResponse);

    // Save AI response
    const aiMessage = await prisma.message.create({
      data: {
        content: aiResponse.content,
        isUser: false,
        role: 'assistant',
        imageUrl: aiResponse.imageUrl,
        chatId: params.chatId,
      },
    });

    console.log('Created AI message:', aiMessage);

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: params.chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json([userMessage, aiMessage]);
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create message' },
      { status: 500 }
    );
  }
}
