import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createContentPrompt(
  title,
  topic,
  outline,
  key,
  previousSections = ''
) {
  return (
    `You're crafting a section for the blog post titled: "${title}".\n` +
    `Your current focus is the topic "${topic}".\n` +
    `IMPORTANT: Dive straight into the content; do NOT preface with the heading title or repeat it.\n` +
    `${
      previousSections
        ? `Previously covered sections include:\n${previousSections}\nYour content should offer fresh insights and not reiterate these points.`
        : ``
    }` +
    `Ensure your writing flows naturally and is easy to read, engaging readers from start to finish.\n` +
    `Use clear, simple language, but pepper it with engaging anecdotes or examples where relevant.\n` +
    `Structure the content with appropriate HTML tags, such as <h3> for subheadings, <b> for emphasis, and <ul> or <ol> for lists.\n` +
    `Provide valuable information, ensuring readers leave with new knowledge or insights. Include the keyword "${key}" tastefully, just once, for SEO purposes. Remember, the content should read as an integral part of the entire blog, not as a standalone piece.`
  );
}

async function generateContent(title, topic, outline, key, previousSections) {
  const prompt = createContentPrompt(
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

export { createContentPrompt, generateContent };
