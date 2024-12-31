import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sei un assistente virtuale amichevole e disponibile. Rispondi in modo conciso ma completo."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0]?.message?.content || "Mi dispiace, non sono riuscito a generare una risposta.";
  } catch (error) {
    console.error('Error generating response:', error);
    return "Si è verificato un errore nella generazione della risposta.";
  }
}
