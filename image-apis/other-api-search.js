import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { formatImageTitle } from '../utils/image-helpers.js';
dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

async function fetchUnsplashImage(key) {
  const resultsPerPage = 30; // Adjust if more results per page are desired
  const randomPage = Math.floor(Math.random() * 10) + 1; // Assuming Unsplash has at least 30 pages available

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${key}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${resultsPerPage}&page=${randomPage}`
  );
  const data = await response.json();

  const randomIndex = Math.floor(Math.random() * data.results.length);
  const image = data.results[randomIndex];
  const credit = `Photo by ${image.user.name} on Unsplash`;
  return {
    url: image.urls.regular,
    thumbUrl: image.urls.small,
    title: image.alt_description
      ? formatImageTitle(image.alt_description)
      : formatImageTitle(credit),
    alt: image.alt_description || 'Unsplash Image',
    credit: credit
  };
}

async function fetchPixabayImage(key) {
  const resultsPerPage = 200; // Adjust if more results per page are desired

  const response = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
      key
    )}&image_type=photo&per_page=${resultsPerPage}`
  );
  const data = await response.json();

  const randomIndex = Math.floor(Math.random() * data.hits.length);
  const image = data.hits[randomIndex];
  const credit = image.user
    ? `Photo by ${image.user} on Pixabay`
    : 'Image from Pixabay';
  return {
    url: image.largeImageURL,
    thumbUrl: image.previewURL,
    title: image.tags ? formatImageTitle(image.tags) : formatImageTitle(credit),
    alt: image.tags || 'Pixabay Image',
    credit: credit
  };
}

async function fetchPexelsImage(key) {
  const resultsPerPage = 80; // Adjust if more results per page are desired
  const randomPage = Math.floor(Math.random() * 5) + 1; // Assuming Pexels has at least 30 pages available

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${key}&per_page=${resultsPerPage}&page=${randomPage}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    }
  );
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.photos.length);
  const image = data.photos[randomIndex];
  const credit = `Photo by ${image.photographer} on Pexels`;
  return {
    url: image.src.large,
    thumbUrl: image.src.tiny,
    title: image.alt ? formatImageTitle(image.alt) : formatImageTitle(credit),
    alt: image.alt,
    credit: credit
  };
}

export { fetchUnsplashImage, fetchPixabayImage, fetchPexelsImage };
