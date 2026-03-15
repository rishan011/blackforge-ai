const url = "https://www.youtube.com/watch?v=libKVRa0lL8";
fetch(`https://www.youtube.com/oembed?url=${url}&format=json`)
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
