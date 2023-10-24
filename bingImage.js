import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const subscriptionKey = process.env.BING_KEY;

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

function searchBingImage(query, wide = false, publicLicense = false) {
  let uri = `https://api.bing.microsoft.com/v7.0/images/search?q=${query}`;

  uri = wide ? uri + `&aspect=Wide` : uri;

  uri = publicLicense
    ? uri + `&license=Public`
    : uri + `&license=ShareCommercially`;

  return axios
    .get(uri, {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    })
    .then((response) => {
      return {
        url: response.data.value[0].contentUrl,
        thumbUrl: response.data.value[0].thumbnailUrl,
        title: formatImageTitle(response.data.value[0].name),
        alt: response.data.value[0].name
      };
    })
    .catch((error) => {
      console.error(error);
    });
}

export { searchBingImage };
