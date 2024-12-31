import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { messages, config } = await request.json();
    console.log('Received request:', { chatId: params.chatId, config, messageCount: messages.length });

    if (!config.provider || !config.model || !config.apiKey) {
      console.error('Missing configuration:', { provider: config.provider, model: config.model, hasApiKey: !!config.apiKey });
      throw new Error('Missing required configuration: provider, model, or API key');
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages:', messages);
      throw new Error('Invalid or empty messages array');
    }

    // Update chat settings before generating response
    try {
      const updatedChat = await prisma.chat.update({
        where: { id: params.chatId },
        data: {
          modelProvider: config.provider,
          modelName: config.model,
          updatedAt: new Date(),
        },
      });
      console.log('Updated chat settings:', updatedChat);
    } catch (dbError) {
      console.error('Error updating chat settings:', dbError);
    }

    let response;
    try {
      switch (config.provider) {
        case 'openai':
          const openai = new OpenAI({
            apiKey: config.apiKey,
          });

          if (config.model === 'dall-e-3') {
            const imageResponse = await openai.images.generate({
              model: 'dall-e-3',
              prompt: messages[messages.length - 1].content,
              n: 1,
              size: '1024x1024',
            });

            response = {
              content: 'Image generated successfully',
              imageUrl: imageResponse.data[0].url,
            };
          } else {
            const openaiMessages = messages.map((m: Message) => ({
              role: m.role,
              content: m.content,
            }));

            console.log('Sending to OpenAI:', {
              model: config.model,
              messageCount: openaiMessages.length,
              temperature: config.temperature,
              maxTokens: config.maxTokens,
            });

            const completion = await openai.chat.completions.create({
              messages: openaiMessages,
              model: config.model,
              temperature: config.temperature || 0.7,
              max_tokens: config.maxTokens || 1000,
            });

            if (!completion.choices?.[0]?.message?.content) {
              console.error('Empty OpenAI response:', completion);
              throw new Error('No response generated from OpenAI');
            }

            response = {
              content: completion.choices[0].message.content,
              imageUrl: null,
            };
            console.log('OpenAI response:', response);
          }
          break;

        case 'anthropic':
          const anthropic = new Anthropic({
            apiKey: config.apiKey,
          });

          const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
          const userMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            }));

          console.log('Sending to Anthropic:', {
            model: config.model,
            messageCount: userMessages.length,
            hasSystemPrompt: !!systemPrompt,
          });

          const anthropicResponse = await anthropic.messages.create({
            model: config.model,
            max_tokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.7,
            system: systemPrompt,
            messages: userMessages,
          });

          if (!anthropicResponse.content[0]?.text) {
            console.error('Empty Anthropic response:', anthropicResponse);
            throw new Error('No response generated from Anthropic');
          }

          response = {
            content: anthropicResponse.content[0].text,
            imageUrl: null,
          };
          console.log('Anthropic response:', response);
          break;

        case 'google':
          const genAI = new GoogleGenerativeAI(config.apiKey);
          const model = genAI.getGenerativeModel({ model: config.model });

          console.log('Sending to Google:', {
            model: config.model,
            messageCount: messages.length,
          });

          const googleChat = model.startChat({
            history: messages.map(m => ({
              role: m.role,
              parts: [{ text: m.content }],
            })),
          });

          const result = await googleChat.sendMessage(messages[messages.length - 1].content);
          const googleResponse = await result.response;
          const responseText = googleResponse.text();

          if (!responseText) {
            console.error('Empty Google response:', googleResponse);
            throw new Error('No response generated from Google AI');
          }

          response = {
            content: responseText,
            imageUrl: null,
          };
          console.log('Google response:', response);
          break;

        default:
          throw new Error(`Unsupported AI provider: ${config.provider}`);
      }

      return NextResponse.json(response);
    } catch (providerError: any) {
      console.error('Provider-specific error:', {
        provider: config.provider,
        model: config.model,
        error: providerError,
        stack: providerError.stack,
      });

      throw new Error(
        providerError.message.includes('API key')
          ? 'Invalid API key. Please check your API key and try again.'
          : `Error from ${config.provider}: ${providerError.message}`
      );
    }
  } catch (error: any) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
