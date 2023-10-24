import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createRelatedKeysPrompt(key) {
  return (
    `Suggest 3 related keyword phrases that customers who searched for ` +
    `"${key}" may also search for.`
  );
}

async function generateRelatedKeys(key) {
  const prompt = createRelatedKeysPrompt(key);

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

export { generateRelatedKeys };
