import { google } from 'googleapis';
const customsearch = google.customsearch('v1');
import dotenv from 'dotenv';
dotenv.config();

function getRandomNumber() {
  const min = 0;
  const max = 9;
  const randomNumber = Math.floor(Math.random() * (max - min)) + min;
  return randomNumber;
}

function formatImageTitle(inputString) {
  // Remove special characters and convert spaces to hyphens
  const formattedString = inputString
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim(); // Trim leading and trailing spaces and hyphens

  return formattedString;
}

async function searchGoogleImage(query) {
  console.log(query);
  try {
    const res = await customsearch.cse.list({
      cx: process.env.GOOGLE_CX,
      q: query,
      auth: process.env.GOOGLE_KEY,
      searchType: 'image',
      rights: 'cc_publicdomain',
      exactTerms: query,
      lr: 'lang_en'
    });
    const randomImg = getRandomNumber();
    return {
      url: res.data.items[randomImg].link,
      thumbUrl: res.data.items[randomImg].image.thumbnailLink,
      title: formatImageTitle(res.data.items[randomImg].title),
      alt: res.data.items[randomImg].snippet
    };
  } catch (error) {
    console.error('Error:', error);
  }
}

export { searchGoogleImage };
