import { Handlers } from "$fresh/server.ts";

let id = 0;

export const handler: Handlers = {
  GET() {
    id += 1;
    return new Response(`${id}`);
  },
};
