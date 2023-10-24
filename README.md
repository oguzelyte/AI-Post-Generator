## Keywords Sheets ##

**Note: green colored keywords already have posts generated**
<br/>
<br/>
For horsebackhaven.com - https://docs.google.com/spreadsheets/d/1uckoTKTb5VabqypkrKacOuScXJR6UjnSGSpOM99kc3I/edit?usp=sharing

## To each site add code snippet below to make yoast description equal to the excerpt:

```
function prefix_filter_description_example($description)
{
global $post;

$description = get_the_excerpt($post->ID);

return $description;
}
add_filter('wpseo_metadesc', 'prefix_filter_description_example');
```

## Images

Use auto upload images to automatically download images locally to wp
https://wordpress.org/plugins/auto-upload-images/

## Auth

Use JSON Basic auth plugin for wpapi
https://github.com/WP-API/Basic-Auth

## Config.json file

```
{
  "key": "key",
  "shortKey": "key",
  "postStatus": "draft",
  "nonAuthorUsers": ["email", "email"],
  "numOfParagraphs": 6
}
```

The key is for the long term topic keyword
Short key is for a more abstract key for image generation
Non author users are emails of users you don't want chosen as authors
Number of paragraphs is the amount of paragraphs you want to generate

## To generate posts

Run `node index.js`
