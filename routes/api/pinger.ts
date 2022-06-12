import { Handlers } from "$fresh/server.ts";

// All the urls that the server will be monitoring
// This includes urls from different users
const globalUrls = new Map<number, Map<string, "up" | "down">>();

async function pinger(users: Map<number, Map<string, "up" | "down">>) {
  while (true) {
    for (const userId of users.keys()) {
      for (const [url] of globalUrls.get(userId)!) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            console.log(`${url} is up`);
            users.get(userId)!.set(url, "up");
          } else {
            console.error(`${url} is down`);
            users.get(userId)!.set(url, "down");
          }
        } catch (e) {
          console.error(`${url} is down`);
          console.error(e);

          users.get(userId)!.set(url, "down");
        }
      }
    }
    if (users.size != 0) {
      console.log("");
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

pinger(globalUrls);

export const handler: Handlers = {
  GET(req) {
    const id = parseInt(new URL(req.url).search.replace("?id=", ""));
    if (globalUrls.has(id)) {
      return new Response(
        JSON.stringify(Object.fromEntries(globalUrls.get(id)!)),
      );
    } else {
      return new Response(JSON.stringify(new Map()));
    }
  },
  async POST(req) {
    const { id, urls }: { id: number; urls: string[] } = await req.json();
    globalUrls.set(
      id,
      new Map(urls.map((url) => [url, globalUrls.get(id)?.get(url) || "down"])),
    );
    return new Response("", { status: 200 });
  },
};
