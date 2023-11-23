import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { getPromptModule } from '../utils/prompt-helpers.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

async function generateContent(title, topic, outline, key, previousSections) {
  const promptModule = await getPromptModule();

  const prompt = promptModule.createContentPrompt(
    title,
    topic,
    outline,
    key,
    previousSections
  );

  try {
    const completion = await openai.chat.completions.create({
      // If you have GPT-4 API access, change the model gpt-4
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.7,
      n: 1,
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message;
    return message.content;
  } catch (error) {
    console.error('Error occurred while generating content:', error);
    return 'An error occurred while generating content.';
  }
}

export { generateContent };
