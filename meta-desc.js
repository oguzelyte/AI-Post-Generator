import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createMetaDescPrompt(key, relatedKeys) {
  return (
    `As an SEO writer, create a meta description that uses the keyword ${key} ` +
    `as the primary keyword. Try to include 1 of these related keywords ${relatedKeys}` +
    `End with a call to action.` +
    `Length of the meta description has to be between 150-160 characters MAXIMUM.`
  );
}

async function generateMetaDesc(key, relatedKeys) {
  const prompt = createMetaDescPrompt(key, relatedKeys);

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

export { generateMetaDesc };
