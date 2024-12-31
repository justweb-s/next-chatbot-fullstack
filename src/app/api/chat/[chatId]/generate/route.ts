import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { message } = await request.json();
    
    // Generate response using OpenAI
    const aiResponse = await generateResponse(message);
    
    // Save the AI response to the database
    const savedMessage = await prisma.message.create({
      data: {
        content: aiResponse,
        isUser: false,
        chatId: params.chatId,
      },
    });
    
    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Error generating response' },
      { status: 500 }
    );
  }
}
