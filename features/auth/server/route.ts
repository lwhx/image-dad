import { auth } from "@clerk/nextjs/server";
import { Hono } from "hono";

const app = new Hono().get("/token", async (c) => {
  const { getToken } = await auth();
  const token = await getToken({ template: "Basic" });

  return c.json({ data: token });
});

export default app;
