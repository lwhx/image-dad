import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { updatePasswordSchema } from "../schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const res = await auth.api.listUserAccounts({
      headers: await headers(),
    });

    return c.json({ data: res });
  })
  .post(
    "/set-password",
    sessionMiddleware,
    zValidator("form", updatePasswordSchema),
    async (c) => {
      const { password } = c.req.valid("form");
      const res = await auth.api.setPassword({
        body: {
          newPassword: password,
        },
        headers: await headers(),
      });

      return c.json({ data: res });
    }
  )
  .post(
    "/update-password",
    sessionMiddleware,
    zValidator("form", updatePasswordSchema),
    async (c) => {
      const { currentPassword, password } = c.req.valid("form");

      if (!currentPassword) {
        return c.json({ error: "Current password is required" }, 400);
      }

      try {
        const res = await auth.api.changePassword({
          body: {
            newPassword: password,
            currentPassword,
            revokeOtherSessions: true,
          },
          headers: await headers(),
        });

        return c.json({ data: res });
      } catch (error) {
        return c.json({ error: (error as Error).message }, 400);
      }
    }
  );

export default app;
