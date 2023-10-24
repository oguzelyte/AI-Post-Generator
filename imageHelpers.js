import { searchBingImage } from './bingImage.js';
import { searchGoogleImage } from './googleImgSearch.js';
import config from './config.json' assert { type: 'json' };

const ImgGenerator = {
  BING: 'bing',
  GOOGLE: 'google',
  DALLE: 'dalle'
};

async function generateImageHTML(topic, ImgGeneratorType) {
  let image = '';

  switch (ImgGeneratorType) {
    case ImgGenerator.BING:
      image = await searchBingImage(topic, true);
      if (!image || !image.url) {
        image = await searchBingImage(config.key, true);
      }
      break;
    case ImgGenerator.GOOGLE:
      image = await searchGoogleImage(topic);
      if (!image || !image.url) {
        image = await searchGoogleImage(config.key);
      }
      break;
  }

  const imgHTML = `<img src="${image.url}" alt="${image.alt}" />`;

  return imgHTML;
}

export { generateImageHTML, ImgGenerator };
