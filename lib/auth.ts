import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const runtime = "edge";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: DrizzleAdapter(createDb(), {
  //   usersTable: users,
  //   accountsTable: accounts,
  //   sessionsTable: sessions,
  // }),
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
});
