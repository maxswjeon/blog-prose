import argon2 from "argon2";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "./prisma";

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

				const user = await prisma.user.findFirst({
					where: {
						username: credentials.username,
					},
				});

				if (!user) {
					return null;
				}

				const valid = argon2.verify(user.password, credentials.password);
				if (!valid) {
					return null;
				}

				const safeUser = {
					id: user.id,
					name: user.name,
					username: user.username,
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
