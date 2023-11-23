import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { getPromptModule } from '../utils/prompt-helpers.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateOutline(title, key, numOfParagraphs) {
  const promptModule = await getPromptModule();

  const prompt = promptModule.createOutlinePrompt(title, key, numOfParagraphs);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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
