import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        if (!process.env.USER_ID || !process.env.USER_PASSWORD) {
          return null;
        }

        if (
          process.env.USER_ID !== credentials.username ||
          process.env.USER_PASSWORD !== credentials.password
        ) {
          return null;
        }

        const safeUser = {
          id: "admin",
          username: credentials.username,
        };

        return safeUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (user) {
        session.user = user;
      }

      if (token) {
        session.user = { ...token };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
} satisfies AuthOptions;

export default authOptions;
