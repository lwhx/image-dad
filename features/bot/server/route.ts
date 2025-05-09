import { webhookCallback } from "grammy";
import { Hono } from "hono";

import { createBot } from "@/lib/bot";

const app = new Hono();

app.post("/", async (c) => {
  const bot = await createBot();
  if (!bot) {
    return c.text("BOT_TOKEN is not defined", 500);
  }

  const handleUpdate = webhookCallback(bot, "hono");
  return handleUpdate(c);
});

export default app;
