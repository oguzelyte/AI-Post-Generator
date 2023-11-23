import { searchBingImage } from '../image-apis/bing-image.js';
import { searchGoogleImage } from '../image-apis/google-img-search.js';
import { fetchUnsplashImage } from '../image-apis/other-api-search.js';
import { fetchPexelsImage } from '../image-apis/other-api-search.js';
import { fetchPixabayImage } from '../image-apis/other-api-search.js';

const ImgGenerator = {
  BING: 'bing',
  GOOGLE: 'google',
  DALLE: 'dalle',
  UNSPLASH: 'unsplash',
  PIXABAY: 'pixabay',
  PEXELS: 'pexels'
};

async function retrieveImageData(ImgGeneratorType, key) {
  switch (ImgGeneratorType) {
    case ImgGenerator.BING:
      return searchBingImage(key, true);
    case ImgGenerator.GOOGLE:
      return searchGoogleImage(key);
    case ImgGenerator.UNSPLASH:
      return fetchUnsplashImage(key);
    case ImgGenerator.PIXABAY:
      return fetchPixabayImage(key);
    case ImgGenerator.PEXELS:
      return fetchPexelsImage(key);
    default:
      throw new Error('Invalid ImgGeneratorType provided');
  }
}
async function generateImageHTML(ImgGeneratorType, key) {
  const image = await retrieveImageData(ImgGeneratorType, key);

  // Only include credit if it exists
  const creditHTML = image.credit
    ? `<figcaption class="wp-element-caption">${image.credit}</figcaption>`
    : '';

  const imgHTML =
    `<figure class="wp-block-image size-large">` +
    `<img src="${image.url}" alt="${image.alt}" title="${image.alt}">` +
    `${creditHTML}</figure>`;

  return imgHTML;
}

function formatImageTitle(inputString) {
  // Remove special characters and convert spaces to hyphens
  const formattedString = inputString
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim() // Trim leading and trailing spaces and hyphens
    .replace(/-$/, ''); // Remove the last hyphen if it exists

  return formattedString;
}

export { generateImageHTML, ImgGenerator, retrieveImageData, formatImageTitle };
