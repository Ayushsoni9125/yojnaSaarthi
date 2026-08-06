import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db/mongoose";
import User from "@/models/User";

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

            async authorize(credentials) {
                await connectDB();

                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) {
                    return null;
                }

                const user = await User.findOne({ email });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    cookies: {
        sessionToken: {
            name: `yojana-saarthi.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
            },
        },
        callbackUrl: {
            name: `yojana-saarthi.callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: false,
            },
        },
        csrfToken: {
            name: `yojana-saarthi.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
            },
        },
        state: {
            name: `yojana-saarthi.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
                maxAge: 900,
            },
        },
        pkceCodeVerifier: {
            name: `yojana-saarthi.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
                maxAge: 900,
            },
        },
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();

                const existingUser = await User.findOne({
                    email: user.email,
                });

                if (existingUser) {
                    if (existingUser.email === process.env.ADMIN_EMAIL && existingUser.role !== "admin") {
                        existingUser.role = "admin";
                        await existingUser.save();
                    }
                } else {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: "google",
                        role:
                            user.email === process.env.ADMIN_EMAIL
                                ? "admin"
                                : "user",
                    });
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            await connectDB();

            const email = user?.email ?? token.email;

            if (email) {
                const dbUser = await User.findOne({ email });

                if (dbUser) {
                    if (email === process.env.ADMIN_EMAIL && dbUser.role !== "admin") {
                        dbUser.role = "admin";
                        await dbUser.save();
                    }
                    token.role = dbUser.role;
                    token.name = dbUser.name;
                    // Do not store base64 string in cookie to prevent Request Header Fields Too Large (431)
                    token.picture = dbUser.image?.startsWith("data:image/") ? "" : dbUser.image;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                session.user.name = token.name;
                session.user.image = token.picture as string;
            }

            return session;
        },
    },
});