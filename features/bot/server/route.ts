import { webhookCallback } from "grammy";
import { Hono } from "hono";

import { createBot } from "@/lib/bot";

const app = new Hono().post(
  "/",
  async (_c, next) => {
    return next();
  },
  webhookCallback(createBot(), "hono")
);

export default app;
