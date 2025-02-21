import { webhookCallback } from "grammy";
import { Env } from "./types";
import { createBot } from "./createBot";
import { createPhotoListen } from "./utils/create-photo-listen";

const main = {
  async fetch(request: Request, env: Env) {
    try {
      const bot = createBot(env);

      createPhotoListen(bot, env);

      return webhookCallback(bot, "cloudflare-mod")(request);
    } catch (error) {
      console.error("Error handling update:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

export default main;
