import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

async function generateImage(key) {
  try {
    const response = await openai.images.generate({
      prompt: `Realistic, photography based on keywords: "${key}, Sigma 85 mm f/1.4`,
      n: 1,
      size: '1024x1024'
    });
    return response;
  } catch (error) {
    console.error('Error occurred while generating image:', error);
    return 'An error occurred while generating title.';
  }
}

export { generateImage };
