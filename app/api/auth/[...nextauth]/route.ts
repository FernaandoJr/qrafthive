import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";
import argon2 from "argon2";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
        };
    }
}

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({ email: credentials?.email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }

                const isValidPassword = await argon2.verify(user.password, credentials?.password ?? "");
                if (!isValidPassword) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: (user._id as mongoose.Types.ObjectId).toString(),
                    email: user.email,
                    name: user.fullName,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async signIn({ account, profile }) {
            if (account?.provider === "github" || account?.provider === "google") {
                await connectDB();
                const existingUser = await User.findOne({ email: profile?.email });
                if (!existingUser) {
                    await User.create({
                        fullName: profile?.name,
                        email: profile?.email,
                    })
                }
            }
            return true 
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    image: token.image as string,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
