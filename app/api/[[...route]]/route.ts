import { Hono } from "hono";
import { handle } from "hono/vercel";

import bot from "@/features/bot/server/route";
import images from "@/features/images/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/images", images).route("/bot", bot);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
