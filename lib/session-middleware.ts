import { createMiddleware } from "hono/factory";
import { auth } from "./auth";
import { User } from "next-auth";

type AdditionalContext = {
  Variables: {
    user: User;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = await auth();
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", session.user!);
    await next();
  }
);
