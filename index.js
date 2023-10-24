import { generateContent } from './content.js';
import { generateTitle } from './title.js';
import { generateRelatedKeys } from './relatedKeys.js';
import { generateOutline } from './outline.js';
import { generateExcerpt } from './excerpt.js';
import config from './config.json' assert { type: 'json' };
import { ImgGenerator, generateImageHTML } from './imageHelpers.js';
import { createH2 } from './textHelpers.js';
import { processUploadPostToWP } from './post-to-wp.js';
import { searchBingImage } from './bingImage.js';

try {
  console.log('Generating title, please wait...');
  const title = await generateTitle(config.key);
  console.log('Title generated!');

  console.log('Generating outline, please wait...');
  const outline = await generateOutline(title, config.key);

  console.log('Outline generated!\n');
  const topics = outline.split(/\n+/);
  console.log('Outline is: \n' + outline + '\n');
  console.log('Topics are: \n' + topics + '\n');

  let content = '';

  console.log('Generating content, please wait...');

  for (const [index, topic] of topics.entries()) {
    if (!topic.trim()) {
      continue;
    }
    const paragraph = await generateContent(title, topic, outline, config.key);
    let topicImage = '';

    if (index % 2 !== 0) {
      topicImage = await generateImageHTML(
        config.shortKey,
        ImgGenerator.GOOGLE
      );
    }

    content += topicImage + createH2(topic) + paragraph + '\n\n';
    console.log(`Paragraph ${index + 1} generation done.`);
  }
  console.log('Content generated!');

  console.log('Generating related keys, please wait...');
  const relatedKeys = await generateRelatedKeys(config.key);
  console.log('Related keys generated!');

  console.log('Generating excerpt keys, please wait...');
  const excerpt = await generateExcerpt(config.key, content, relatedKeys);
  console.log('Excerpt generated!');

  console.log('Generating featured image, please wait...');
  const featuredImage = await searchBingImage(config.shortKey, true, true);
  console.log('Featured image generated!');

  console.log('Uploading post to wp, please wait...');

  processUploadPostToWP({ content, title, excerpt, featuredImage });
} catch (error) {
  console.error(error);
}
