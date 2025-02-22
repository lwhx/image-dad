import bot from "@/lib/bot";
import { webhookCallback } from "grammy";
import { Hono } from "hono";

const app = new Hono().post(
  "/",
  (_c, next) => {
    return next();
  },
  webhookCallback(bot, "hono")
);

export default app;
