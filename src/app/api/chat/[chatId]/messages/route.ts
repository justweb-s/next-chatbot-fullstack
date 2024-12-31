import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chat/[chatId]/messages - Get all messages for a chat
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: params.chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching messages' },
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
    const { content, isUser } = await request.json();
    const message = await prisma.message.create({
      data: {
        content,
        isUser,
        chatId: params.chatId,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating message' },
      { status: 500 }
    );
  }
}
