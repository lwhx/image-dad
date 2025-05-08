import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { createDb } from "./db";
import { accounts, sessions, users } from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => ({
  adapter: DrizzleAdapter(await createDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [GitHub],
  callbacks: {
    signIn({ profile }) {
      const allowEmails = process.env.ALLOW_EMAILS?.split(",");
      if (!allowEmails || !profile?.email) return false;

      if (allowEmails.includes(profile.email)) {
        return true;
      }

      return false;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
}));
