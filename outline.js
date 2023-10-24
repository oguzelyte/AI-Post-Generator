import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import config from './config.json' assert { type: 'json' };

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createOutlinePrompt(title, key) {
  return (
    `Please ignore all previous instructions. You are an expert ` +
    `copywriter who creates content outlines. You have a Friendly tone of voice.\n` +
    `You have a Conversational writing style. Create a list of headings ` +
    `in the english language for a blog post titled "${title}". The outline should only include ` +
    ` ${config.numOfParagraphs} headings.` +
    `Please do not number the headings. The primary key of this blog post is: "${key}". ` +
    `Include it sparingly in some headings.\n ` +
    `Do not self reference.\n` +
    `Do not explain what you are doing.\n` +
    `Do not include the conclusion heading.\n` +
    `Provide result in format: "Heading title 1\\nHeading title 2\\nHeading title 3" and so on.`
  );
}

async function generateOutline(title, key) {
  const prompt = createOutlinePrompt(title, key);
  try {
    const completion = await openai.chat.completions.create({
      // If you have GPT-4 API access, change the model gpt-4
      model: 'gpt-3.5-turbo-16k',
      max_tokens: 4000,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message;
    return message.content;
  } catch (error) {
    console.error('Error occurred while generating title:', error);
    return 'An error occurred while generating title.';
  }
}

export { generateOutline };
