const url = "https://www.youtube.com/watch?v=libKVRa0lL8";
const oembedUrl = `https://www.youtube.com/oembed?url=${url}&format=json`;
console.log("Fetching:", oembedUrl);
fetch(oembedUrl)
  .then(async r => {
     console.log("Status:", r.status);
     const text = await r.text();
     console.log("Response:", text.substring(0, 100));
  })
  .catch(console.error);
