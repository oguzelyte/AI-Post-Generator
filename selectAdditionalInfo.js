import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export const TYPE = {
  AUTHOR: 'author',
  CATEGORY: 'category'
};

function selectCategoryPrompt(key, info) {
  return (
    `This is the generated blog post main keyword: "${key}".` +
    `These are possible categories for it: "${info}"` +
    `Each category comes with ID, title and description.` +
    `Select the category most suitable for the blog post.` +
    `Answer ONLY with category ID as an integer, do not include other text or comments.`
  );
}

function selectAuthorPrompt(key, info) {
  return (
    `Forget everything I asked you before.\n` +
    `This is the generated blog post main keyword:\n"${key}".\n` +
    `These are possible authors for the blog post: "${info}"` +
    `Each author comes with ID, name and background information.\n` +
    `Select the author that was most likely to post the blog post.\n` +
    `Make sure to ONLY give the author ID NUMBER as the answer, no other text or comments.`
  );
}

async function selectAdditionalInfo(key, type, info) {
  let prompt = '';

  switch (type) {
    case TYPE.AUTHOR:
      prompt = selectAuthorPrompt(key, info);
      break;
    case TYPE.CATEGORY:
      prompt = selectCategoryPrompt(key, info);
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
