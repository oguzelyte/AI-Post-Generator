import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createExcerptPrompt(key, content, relatedKeys) {
  return (
    `As a seo writer, create an excerpt that uses the keyword "${key}. Try to reference it early in the excerpt."` +
    `Try to include 1-2 of the related keywords: "${relatedKeys}".\n` +
    `The excerpt has to summarize this content: "${content}.\n` +
    `The excerpt has to pique curiosity and act as a modest clickbait.\n` +
    `Avoid starting with the word 'discover'.\n` +
    `The length should be between 150-160 characters MAXIMUM.`
  );
}

async function generateExcerpt(key, content, relatedKeys) {
  const prompt = createExcerptPrompt(key, content, relatedKeys);

  try {
    const completion = await openai.chat.completions.create({
      // If you have GPT-4 API access, change the model gpt-4
      model: 'gpt-3.5-turbo-16k',
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

export { generateExcerpt };
