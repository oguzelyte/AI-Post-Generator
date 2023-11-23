function createContentPrompt(
  title,
  topic,
  outline,
  key,
  previousSections = ''
) {
  return `
  You are an AI that specializes in creating SEO-optimized blog post content.
  The blog post is titled "${title}" and consists of unique sections covering different parts of the blog post.
  
  Your task is to write content for ONE SECTION of the blog post about this topic - ${topic}.

  Section content instructions:
  1. Dive into the content immediately, do NOT include the topic title.
  2. Ensure your writing flows naturally and is easy to read, engaging readers from start to finish.
  3. Write in the style of Callie King.
  4. Structure the content with appropriate HTML tags, such as <h3> for subheadings, <b> for emphasis, and <ul> or <ol> for lists.
  5. The content length should be between 400-600 words.
  6. Provide valuable information, ensuring readers leave with new knowledge or insights.
  7. You must include the keyword "${key}" tastefully, just once, for SEO purposes.
  8. Content should read as an integral part of the entire blog post, not as a standalone piece.
  9. If there are previous blog post sections below prefaced with [PREVIOUS SECTIONS], your content MUST NOT overlap, clash or reiterate them.
  
  ${previousSections ? `[PREVIOUS SECTIONS] - ${previousSections}.` : ''}
  `;
}

function createTitlePrompt(imagine) {
  return `You are an experienced content writer. You excel in creating compelling blog post titles. Your expertise is in the horse niche and you write in a friendly style. Your style inspiration is Callie King. You don't use big words like unveil, unleash or mysteries.

  Your task is to create a blog title around for this key theme: "${imagine}".
  
  Instructions for title:
  1. Title is succinct, with a maximum of 50-60 characters.
  2. Title is clear and direct that appeals to horse enthusiasts.
  3. Title is straightforward.
  4. Title is not surrounded with quotation marks.
  5. Title DOES NOT contain words like unveil, unleash, mysteries or others.
  7. Attempt to start the title exactly with "${imagine}" if it sounds natural.`;
}

function createOutlinePrompt(title, key, numOfParagraphs) {
  return `
    You are an AI that specializes in creating SEO-optimized structured outlines for blog posts in JSON format.
    Your task is to design a structured section outline for a blog titled - ${title}.

    The JSON structure should adhere to these guidelines: 
    1. Use an array called "outline" to hold the main sections of the blog.
    2. Each section in the array should be an object with JUST the key "text"
    3. "text" should include the heading that will serve as the heading for the upcoming section content
    4. For SEO optimization, include keywords from the blog title in the headings wherever relevant and natural.
    
    The outline should include:
    1. At least 1 but not more than ${numOfParagraphs} main content section headings

    Specific heading instructions:
    1. Do not start headings with "Section number"or "Introduction" or "Conclusion", start with the heading text immediately

    Craft this structured outline with creativity and precision, ensuring that the content flow is natural
    for readers and conducive to SEO strategies employed by the best writers in the world.
    The outline should serve as a comprehensive guide for writing an engaging, informative,
    and SEO-friendly blog post on the topic of ${key}.
    You write your outlines in the style of Callie King.`;
}

function createExcerptPrompt(key, content) {
  return (
    `As a seo writer, create an excerpt that uses the keyword "${key}. Try to reference it early in the excerpt."` +
    `The excerpt has to summarize this content: "${content}.\n` +
    `The excerpt has to pique curiosity and act as a modest clickbait.\n` +
    `Avoid starting with the word 'discover'.\n` +
    `The length should be between 150-160 characters MAXIMUM.`
  );
}

function selectCategoryPrompt(key, info) {
  return (
    `This is the generated blog post main keyword: "${key}".` +
    `These are possible categories for it: "${info}"` +
    `Each category comes with ID, title and description.` +
    `Select the category most suitable for the blog post.` +
    `Answer ONLY with category ID as an integer, do not include other text or comments.`
  );
}

function selectAuthorPrompt(key, info) {
  return (
    `Forget everything I asked you before.\n` +
    `This is the generated blog post main keyword:\n"${key}".\n` +
    `These are possible authors for the blog post: "${info}"` +
    `Each author comes with ID, name and background information.\n` +
    `Select the author that was most likely to post the blog post.\n` +
    `Make sure to ONLY give the author ID NUMBER as the answer, no other text or comments.`
  );
}

export {
  createContentPrompt,
  createTitlePrompt,
  createOutlinePrompt,
  createExcerptPrompt,
  selectCategoryPrompt,
  selectAuthorPrompt
};
