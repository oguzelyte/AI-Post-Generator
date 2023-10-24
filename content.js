import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createContentPrompt(title, topic, outline, key) {
  return (
    `As an engaging blog writer, you are creating a blog post titled: "${title}".\n` +
    `You will be writing about one section from the blog post.\n` +
    `Write a 350-500 word section for the heading "${topic}" in a conversational tone and ` +
    `in an engaging and friendly manner. Make sure not to have overlap with other headings.\n` +
    `Do not include a conclusion paragraph.\n` +
    `Format the section with HTML tags including sub-headings like h3, bold, UL/OL tags.\n` +
    `Use accessible language and weave in authoritative advice, making the content ` +
    `both informative and enjoyable for the reader.\n` +
    `Make sure to include "${key}" keyword in the text for SEO purposes.\n` +
    `The keyword should appear not more than 1 time in the whole section.\n` +
    `Write just the content for the section, do not include the heading title.`
  );
}

async function generateContent(title, topic, outline, key) {
  const prompt = createContentPrompt(title, topic, outline, key);
  try {
    const completion = await openai.chat.completions.create({
      // If you have GPT-4 API access, change the model gpt-4
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message;
    return message.content;
  } catch (error) {
    console.error('Error occurred while generating content:', error);
    return 'An error occurred while generating content.';
  }
}

export { createContentPrompt, generateContent };
