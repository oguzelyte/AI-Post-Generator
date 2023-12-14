import OpenAI from 'openai';
import { titleSystemPrompt1 } from './titles.js';

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function chat3(
  prompt,
  temp = 0.5,
  system_message = 'You are a helpful assistant'
) {
  const completion = await openai.chat.completions.create({
    // model: 'gpt-3.5-turbo',
    model: 'gpt-4-1106-preview',
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
  const systemPrompt = titleSystemPrompt1;

  // const prompt = `
  //  You are an expert copywriter who writes catchy titles for blog posts. You have a Informative tone of voice. You have a Conversational writing style. Write a catchy blog post title with a hook for the topic "${keyword}". The titles should be written in the english language. The titles should be less than 60 characters. The titles should include the wordsfrom the topic "${keyword}". Do not use single quotes, double quotes or any other enclosing characters. Do not self reference. Do not explain what you are doing.
  // `;

  const prompt = `Generate blog post title based on this keyword: "${keyword}"`;

  console.info('Generating title...');

  return await chat3(prompt, 1, systemPrompt);
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

async function generateIntroduction(title) {
  const system_message = `
Your only purpose is to write blog article introductions from a given title.
Use short paragraphs instead of big walls of text
Break up long sentences because they’re hard to follow
Write in conversational tone
When writing an introduction use the 'APP formula:

[A]lign yourself with the reader’s problem
[P]resent your post as the solution to that problem
[P]roof as to why they should trust you

Example:

“(Looking to grow you YT channel and attract more views? [Align]) (The ‘trick’ is to target topics with search demand. [Present])

(This is the approach that helped us grow our YT channel from ~10,000 to over 200,000 monthly views in around a year. [Proof])"


This is only an example, your introductions should be longer and relavent to the provided title and topic.
`;

  const prompt = `Generate blog post introduction for this title: "${title}"`;

  console.log('Generating introduction...');

  return await chat3(prompt, 0.8, system_message);
}

const keyword = `kayaking for beginners`;

const side_keywords = `kayaking,
how to kayak,
how do you kayak,
lake kayaking,
kayak for beginners`;

const title = await generateTitle(keyword);
// const introduction = await generateIntroduction(title);

console.log(title);
// console.log(introduction);
// const description = await generateDescription(title);
// const outline = await generateOutline(title);
// const post = await generatePost(outline);

// console.log('Title:\n', title);
// console.log('Description:\n', description);
// console.log('Outline:\n', outline);
// console.log('Post:\n', post);
