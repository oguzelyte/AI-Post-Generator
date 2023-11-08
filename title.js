import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createTitlePrompt(imagine) {
  return (
    `As an engaging content writer, craft a unique blog post title ` +
    `with the following guidelines:\n` +
    `- The title should include the keyword "${imagine}".\n` +
    `- Ideally, place the keyword at the beginning, but prioritize quality.\n` +
    `- The title must be between 50-60 characters MAX.\n` +
    `- Provide the title in plain text without quotation marks.`
  );
}
async function generateTitle(imagine) {
  const prompt = createTitlePrompt(imagine);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message;
    return message.content;
  } catch (error) {
    console.error('Error occurred while generating title:', error);
    return 'An error occurred while generating title.';
  }
}

export { generateTitle };
