import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createIntroPrompt(imagine) {
  return (
    `As a viral blog post writer, create an introductory paragraph ` +
    `for an article titled "${imagine}". ` +
    `The length of the paragraph should be between between 100 to 200 words.`
  );
}

async function generateIntro(imagine) {
  const prompt = createIntroPrompt(imagine);

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
    console.error('Error occurred while generating intro:', error);
    return 'An error occurred while generating intro.';
  }
}

export { generateIntro };
