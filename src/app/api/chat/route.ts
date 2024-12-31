import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chat - Get all chats
export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        messages: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching chats' }, { status: 500 });
  }
}

// POST /api/chat - Create a new chat
export async function POST() {
  try {
    const chat = await prisma.chat.create({
      data: {},
    });
    return NextResponse.json(chat);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating chat' },
      { status: 500 }
    );
  }
}
