import { generateContent } from './content.js';
import { generateTitle } from './title.js';
import { generateRelatedKeys } from './relatedKeys.js';
import { generateOutline } from './outline.js';
import { generateExcerpt } from './excerpt.js';
import config from './config.json' assert { type: 'json' };
import {
  ImgGenerator,
  generateImageHTML,
  retrieveImageData
} from './imageHelpers.js';
import { createH2 } from './textHelpers.js';
import { processUploadPostToWP } from './post-to-wp.js';

const imageSources = [
  ImgGenerator.UNSPLASH,
  ImgGenerator.PIXABAY,
  ImgGenerator.PEXELS
];

async function generatePostForSingleKey(keyObj, postNumber) {
  console.log(`Post ${postNumber} is being generated... Key: ${keyObj.key}`);
  try {
    // console.log('Generating title, please wait...');
    const title = await generateTitle(keyObj.key);
    // console.log('Title generated!');

    // console.log('Generating outline, please wait...');
    const outline = await generateOutline(
      title,
      keyObj.key,
      config.numOfParagraphs
    );

    // console.log('Outline generated!\n');
    const topics = outline.split(/\n+/);
    // console.log('Outline is: \n' + outline + '\n');
    // console.log('Topics are: \n' + topics + '\n');

    let content = '';

    // console.log('Generating content, please wait...');

    for (const [index, topic] of topics.entries()) {
      if (!topic.trim()) {
        continue;
      }
      const paragraph = await generateContent(
        title,
        topic,
        outline,
        keyObj.key,
        content
      );
      let topicImage = '';

      if (index % 2 !== 0) {
        const randomSource =
          imageSources[Math.floor(Math.random() * imageSources.length)];
        topicImage = await generateImageHTML(randomSource, keyObj.shortKey);
      }

      content += topicImage + createH2(topic) + paragraph + '\n\n';
      // console.log(`Paragraph ${index + 1} generation done.`);
    }
    // console.log('Content generated!');

    // console.log('Generating related keys, please wait...');
    const relatedKeys = await generateRelatedKeys(keyObj.key);
    // console.log('Related keys generated!');

    // console.log('Generating excerpt keys, please wait...');
    const excerpt = await generateExcerpt(keyObj.key, content, relatedKeys);
    // console.log('Excerpt generated!');

    // console.log('Generating featured image, please wait...');
    const featuredImage = await retrieveImageData(
      ImgGenerator.PIXABAY,
      keyObj.shortKey
    );
    // console.log('Featured image generated!');

    console.log(`Uploading post ${postNumber} to wp...`);

    await processUploadPostToWP(
      { content, title, excerpt, featuredImage },
      keyObj.key,
      config.nonAuthorUsers,
      config.postStatus
    );
    // console.log(`Post ${postNumber} finished generating.`);
  } catch (error) {
    // console.error(`Error generating post for key ${keyObj.key}:`, error);
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
