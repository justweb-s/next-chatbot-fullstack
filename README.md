# Next.js AI Chatbot with Multiple Providers

A modern chatbot application built with Next.js 13+, featuring support for multiple AI providers (OpenAI, Anthropic, Google), real-time chat functionality, and image generation capabilities.

## Features

- 🤖 Multiple AI Provider Support:
  - OpenAI (GPT-3.5, GPT-4, DALL-E 3)
  - Anthropic (Claude)
  - Google (Gemini)
- 💬 Real-time Chat Interface
- 🎨 Image Generation with DALL-E 3
- 🔐 Secure API Key Management
- 📱 Responsive Design
- 🎛️ Configurable AI Parameters:
  - Temperature
  - Max Tokens
  - System Prompts
- 🔄 Chat History Management
- 🎯 Collapsible Settings Panel

## Prerequisites

- Node.js 18+ and npm
- MySQL Database
- API Keys for the AI providers you want to use:
  - OpenAI API Key
  - Anthropic API Key
  - Google AI API Key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-chatbot-fullstack
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables by creating a `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/chatbot"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses a MySQL database with Prisma as the ORM. The schema includes:

- `Chat`: Stores chat sessions and their configurations
- `Message`: Stores individual messages within chats

## Usage

1. Create a New Chat:
   - Click the "New Chat" button in the sidebar

2. Configure AI Settings:
   - Select your preferred AI provider
   - Choose a model
   - Enter your API key
   - Adjust temperature and max tokens
   - Set a custom system prompt if desired

3. Start Chatting:
   - Type your message in the input field
   - Press Enter or click the send button
   - View AI responses in real-time

4. Generate Images:
   - Select OpenAI as the provider
   - Choose DALL-E 3 as the model
   - Enter a descriptive prompt
   - View the generated image in the chat

## Troubleshooting

### Common Issues

1. Database Connection:
   - Verify your DATABASE_URL in .env
   - Ensure MySQL server is running
   - Check database permissions

2. API Keys:
   - Verify API keys are correct
   - Check provider-specific requirements
   - Ensure sufficient API credits

3. Message Not Saving:
   - Check database connection
   - Verify Prisma schema is synced
   - Look for error messages in console

### Error Messages

- "Invalid API Key": Check and update your provider API key
- "Failed to fetch messages": Verify database connection
- "No response generated": Check API provider status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js Team
- Prisma Team
- OpenAI, Anthropic, and Google AI Teams
