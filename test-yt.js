const url = "https://www.youtube.com/watch?v=libKVRa0lL8";
fetch(url).then(r => r.text()).then(html => {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  console.log("Title:", titleMatch ? titleMatch[1] : null);
  console.log("Desc:", descMatch ? descMatch[1] : null);
}).catch(console.error);
