import { Handlers } from "$fresh/server.ts";

// All the urls that the server will be monitoring
// This includes urls from different users
const globalUrls = new Set<string>();

async function pinger(urls: Set<string>) {
  while (true) {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          console.log(`${url} is up`);
          continue;
        }
      } catch { /*ignore*/ }
      console.log(`${url} is down`);
    }
    console.log("");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

pinger(globalUrls);

export const handler: Handlers = {
  async POST(req) {
    const urls = await req.json();
    for (const url of urls) {
      globalUrls.add(url);
    }
    return new Response("", { status: 200 });
  },
};
