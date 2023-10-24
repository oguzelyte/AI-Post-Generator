import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createTitlePrompt(imagine) {
  return (
    `Acting as an engaging content writer, create 1 ` +
    `unique blog post title that includes the keyword "${imagine}" ` +
    `in the text. Try to have the keyword at the beginning of the title, ` +
    `but if it doesn't work, don't sacrifice the quality and place it where it fits.` +
    `The length should be between 50-60 characters MAXIMUM.` +
    `Title must be plain text, no quotation marks around it.`
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
