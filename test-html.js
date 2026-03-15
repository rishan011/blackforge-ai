const url = "https://www.youtube.com/watch?v=libKVRa0lL8";
console.log("Fetching HTML for:", url);
fetch(url)
  .then(async r => {
     const html = await r.text();
     const titleMatch = html.match(/<title>(.*?)<\/title>/i);
     console.log("Title tag:", titleMatch ? titleMatch[1] : "None");
     
     // Look for the hidden JSON ytInitialPlayerResponse
     const jsonMatch = html.match(/var ytInitialPlayerResponse = ({.*?});/);
     if (jsonMatch) {
       try {
         const data = JSON.parse(jsonMatch[1]);
         console.log("JSON Title:", data.videoDetails?.title);
         console.log("JSON Author:", data.videoDetails?.author);
       } catch(e) { console.log("JSON parse error"); }
     }
  })
  .catch(console.error);
