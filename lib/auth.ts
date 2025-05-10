import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";

import { createDb } from "./db";

const db = await createDb();
const allowMails = process.env.ALLOW_EMAILS!.split(",");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" || ctx.path === "/sign-in/email") {
        const email = ctx.body?.email as string;
        if (!allowMails.includes(email)) {
          throw new APIError("UNAUTHORIZED", {
            message:
              "You're not allowed to sign up with this email, please contact the administrator.",
          });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!allowMails.includes(user.email)) {
            throw new APIError("UNAUTHORIZED", {
              message:
                "You're not allowed to sign up with this email, please contact the administrator.",
            });
          }
          return { data: user };
        },
      },
    },
  },
  security: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"],
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
