import { generateContent } from './content-generation/content.js';
import { generateTitle } from './content-generation/title.js';
import { generateOutline } from './content-generation/outline.js';
import { generateExcerpt } from './wp-utils/excerpt.js';
import config from './config/config.json' assert { type: 'json' };
import {
  ImgGenerator,
  generateImageHTML,
  retrieveImageData
} from './utils/image-helpers.js';
import { createH2 } from './utils/text-helpers.js';
import { processUploadPostToWP } from './wp-utils/post-to-wp.js';

const imageSources = [
  ImgGenerator.UNSPLASH,
  ImgGenerator.PIXABAY,
  ImgGenerator.PEXELS
];

async function generatePostForSingleKey(keyObj, postNumber) {
  console.log(`Post ${postNumber} is being generated... Key: ${keyObj.key}`);
  try {
    const title = await generateTitle(keyObj.key);

    const topics = await generateOutline(
      title,
      keyObj.key,
      config.numOfParagraphs
    );

    const topicsJson = JSON.parse(topics);

    let content = '';

    for (let index = 0; index < topicsJson.outline.length; index++) {
      const topic = topicsJson.outline[index];

      const paragraph = await generateContent(
        title,
        topic.text,
        topics,
        keyObj.key,
        content
      );

      let topicImage = '';

      if (index % 2 !== 0) {
        const randomSource =
          imageSources[Math.floor(Math.random() * imageSources.length)];
        topicImage = await generateImageHTML(randomSource, keyObj.shortKey);
      }

      content += topicImage + createH2(topic.text) + paragraph + '\n\n';
    }

    const excerpt = await generateExcerpt(keyObj.key, content);

    const featuredImage = await retrieveImageData(
      ImgGenerator.PIXABAY,
      keyObj.shortKey
    );

    console.log(`Uploading post ${postNumber} to wp...`);

    await processUploadPostToWP(
      { content, title, excerpt, featuredImage },
      keyObj.key,
      config.nonAuthorUsers,
      config.postStatus
    );
  } catch (error) {
    console.error(`Error generating post for key ${keyObj.key}:`, error);
  }
}
async function generateMultiplePosts() {
  const allSettledPromises = config.keysArray.map((keyObj, index) =>
    generatePostForSingleKey(keyObj, index + 1).catch((error) => {
      console.error(`Error generating post for key ${keyObj.key}:`, error);
      return { key: keyObj.key, status: 'rejected', reason: error };
    })
  );

  const results = await Promise.allSettled(allSettledPromises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Post ${index + 1} finished generating.`);
    } else {
      console.log(
        `Post ${index + 1} failed to generate with error: ${result.reason}`
      );
    }
  });

  console.log('All post generation attempts have completed!');
}

generateMultiplePosts();
