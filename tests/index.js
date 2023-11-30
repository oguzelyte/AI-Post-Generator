import OpenAI from 'openai';

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function chat3(prompt, temp = 0.5) {
  const person = 'George Orwell';
  const system_message = `You are a helpful assistant. You immitate the writing style of ${person}, but don't reference him or his works in any way`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: temp,
    messages: [
      { role: 'system', content: system_message },
      { role: 'user', content: prompt }
    ]
  });

  const response = completion.choices[0].message;
  return response.content;
}

async function generateTitle(keyword) {
  const prompt = `
 You are an expert copywriter who writes catchy titles for blog posts. You have a Informative tone of voice. You have a Conversational writing style. Write a catchy blog post title with a hook for the topic "${keyword}". The titles should be written in the english language. The titles should be less than 60 characters. The titles should include the wordsfrom the topic "${keyword}". Do not use single quotes, double quotes or any other enclosing characters. Do not self reference. Do not explain what you are doing. 
`;

  console.info('Generating title...');

  return await chat3(prompt, 1);
}

async function generateDescription(title) {
  const prompt = `
You are an expert copywriter who writes catchy descriptions for blog posts. You have a Informative tone of voice. You have a Conversational writing style. Write a catchy blog post description with a hook for the blog post titled "${title}". The descriptions should be written in the english language. The descriptions should be less than 160 characters. The descriptions should include the words from the title "${title}". Do not use single quotes, double quotes or any other enclosing characters. Do not self reference. Do not explain what you are doing.
`;

  console.info('Generating description...');

  return await chat3(prompt);
}

async function generateOutline(title) {
  const prompt = `
You are an expert copywriter who creates content outlines. You have a Informative tone of voice. You have a Journalistic writing style. Create a long form content outline in the english language for the blog post titled "${title}".  The content outline should include a minimum of 10 headings and subheadings. The outline should be extensive and it should cover the entire topic. Create detailed subheadings that are engaging and catchy. Do not write the blog post, please only write the outline of the blog post. Please do not number the headings. Please add a newline space between headings and subheadings. Do not self reference. Do not explain what you are doing.
`;

  console.info('Generating outline...');

  return await chat3(prompt, 0.2);
}

async function generatePost(outline) {
  const prompt = `You are an expert copywriter who writes detailed and thoughtful blog articles. You have a Informative tone of voice. You have a Journalistic writing style. I will give you an outline for an article and I want you to expand in the english language on each of the subheadings to create a complete article from it. Please intersperse short and long sentences. Utilize uncommon terminology to enhance the originality of the content. Please format the content in a professional format. Do not self reference. Do not explain what you are doing. The blog article outline is - "${outline}"`;

  console.info('Generating post...');

  return await chat3(prompt, 1);
}

const keyword = 'is horse riding a sport';

const title = await generateTitle(keyword);
const description = await generateDescription(title);
const outline = await generateOutline(title);
const post = await generatePost(outline);

console.log('Title:\n', title);
console.log('Description:\n', description);
console.log('Outline:\n', outline);
console.log('Post:\n', post);
