import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize() {
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
});