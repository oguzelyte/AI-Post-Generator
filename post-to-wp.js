import WPAPI from 'wpapi';
import * as dotenv from 'dotenv';
import { TYPE, selectAdditionalInfo } from './selectAdditionalInfo.js';
import config from './config.json' assert { type: 'json' };
import axios from 'axios';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const wp = new WPAPI({
  endpoint: process.env.SITE_JSON_ENDPOINT,
  username: process.env.SITE_USERNAME,
  password: process.env.SITE_PASSWORD
});

async function fetchAndProcessCategories() {
  try {
    const cats = await wp.categories().get();
    let categories = '';

    cats.forEach((category) => {
      categories +=
        `Category ID: ${category.id} \n` +
        `Category Name: ${category.name} \n` +
        `Category Description: ${category.description} \n` +
        `------\n`;
    });

    const catResult = await selectAdditionalInfo(
      config.key,
      TYPE.CATEGORY,
      categories
    );

    const catNumbers = catResult.match(/\d+/g);

    return catNumbers ? catNumbers[0] : '1';
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function fetchAndProcessAuthors() {
  try {
    let authors = await wp.users().get();

    authors = authors.filter(
      (author) => !config.nonAuthorUsers.includes(author.name)
    );

    let authorPrompt = '';

    authors.forEach((author) => {
      authorPrompt +=
        `Author ID: ${author.id} \n` +
        `Author Name: ${author.name} \n` +
        `Author Background: ${
          author.description.length > 0 ? author.description : 'no information'
        } \n` +
        `------\n`;
    });

    return await selectAdditionalInfo(config.key, TYPE.AUTHOR, authorPrompt);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function downloadAndUploadImage(image) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  try {
    const response = await axios({
      url: image.url,
      responseType: 'stream'
    });

    const contentType = response.headers['content-type'];
    let extension;
    if (contentType.startsWith('image/')) {
      extension = contentType.split('/')[1];
    } else if (contentType === 'binary/octet-stream') {
      const urlParts = image.url.split('.');
      extension = urlParts[urlParts.length - 1];
    }

    if (!extension) {
      throw new Error('Could not determine file extension');
    }

    const imagePath = path.join(
      __dirname,
      'featured-images',
      `${image.title}.${extension}`
    );

    const writer = response.data.pipe(fs.createWriteStream(imagePath));

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const mediaResponse = await wp.media().file(imagePath).create({
      file: imagePath,
      alt_text: image.alt
    });

    return mediaResponse.id;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function uploadPostToWP(postInfo) {
  try {
    await wp
      .posts()
      .create({
        title: postInfo.title,
        content: postInfo.content,
        status: config.postStatus,
        categories: [postInfo.categoryID],
        excerpt: postInfo.excerpt,
        author: postInfo.authorID,
        featured_media: postInfo.featImageID
      })
      .then(function (response) {
        console.log('Post uploaded!');
        console.log('success post id: ' + response.id);
      });
  } catch (e) {
    console.log(e);
  }
}

async function processUploadPostToWP(postInfo) {
  const categoryID = await fetchAndProcessCategories();
  const authorID = await fetchAndProcessAuthors();
  const featImageID = await downloadAndUploadImage(postInfo.featuredImage);

  const finalPostInfo = {
    ...postInfo,
    categoryID,
    authorID,
    featImageID
  };

  uploadPostToWP(finalPostInfo);
}

export { processUploadPostToWP };
