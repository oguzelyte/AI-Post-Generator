import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

function createOutlinePrompt(title, key, numOfParagraphs) {
  return (
    `For a blog post titled "${title}", generate ${numOfParagraphs} headings. ` +
    `Specific instructions: ` +
    `1. Do NOT use any numbering or bullet points. ` +
    `2. Avoid using colons and any prelude phrases like 'Topic: Detail'. ` +
    `3. Do NOT include "Introduction", "Conclusion", or any variations of these. ` +
    `4. Each heading should be self-contained and clear. ` +
    `5. Incorporate the primary keyword "${key}" subtly in some, but not all, headings. ` +
    `Follow these instructions closely.`
  );
}
async function generateOutline(title, key, numOfParagraphs) {
  const prompt = createOutlinePrompt(title, key, numOfParagraphs);
  try {
    const completion = await openai.chat.completions.create({
      // If you have GPT-4 API access, change the model gpt-4
      model: 'gpt-4',
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
