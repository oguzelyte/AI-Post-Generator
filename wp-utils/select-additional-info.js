import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { getPromptModule } from '../utils/prompt-helpers.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export const TYPE = {
  AUTHOR: 'author',
  CATEGORY: 'category'
};

async function selectAdditionalInfo(key, type, info) {
  let prompt = '';

  const promptModule = await getPromptModule();

  switch (type) {
    case TYPE.AUTHOR:
      prompt = promptModule.selectAuthorPrompt(key, info);
      break;
    case TYPE.CATEGORY:
      prompt = promptModule.selectCategoryPrompt(key, info);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message;
    return message.content;
  } catch (error) {
    console.error('Error occurred while generating content:', error);
    return 'An error occurred while generating content.';
  }
}

export { selectAdditionalInfo };
