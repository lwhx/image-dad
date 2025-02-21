import { Bot } from "grammy";
import { Env } from "./types";
import { commandStart } from "./utils/command-start";

export function createBot(env: Env) {
  const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

  // 处理 /start 命令
  bot.command("start", async (ctx) => {
    await commandStart(ctx);
  });

  return bot;
}
