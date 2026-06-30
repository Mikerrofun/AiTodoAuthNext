import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { redis } from "@/5shared/lib/redis/redis";
import { checkTokenBucket, RATE_LIMITS } from "@/5shared/lib/rateLimit";
import { AuthErrorCode } from "@/5shared/lib/auth/authErrors";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.login || !credentials?.password) return null;

        const forwarded = req.headers?.["x-forwarded-for"];
        const ip = forwarded
          ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0].trim())
          : "unknown";

        if (ip === "unknown" && process.env.NODE_ENV === "production") {
          return null;
        }
         
        const login = credentials.login;

        // Level 1: Check IP-based rate limit
        const ipKey = `ratelimit:login:ip:${ip}`;
        const ipAllowed = await checkTokenBucket(ipKey, RATE_LIMITS.LOGIN_BY_IP);

        if (!ipAllowed) {
          throw new Error(AuthErrorCode.RATE_LIMIT_IP);
        }

        const accountKey = `ratelimit:login:account:${ip}:${login}`;
        const accountAllowed = await checkTokenBucket(accountKey, RATE_LIMITS.LOGIN_BY_ACCOUNT);

        if (!accountAllowed) {
          throw new Error(AuthErrorCode.RATE_LIMIT_ACCOUNT);
        }

        const user = await prisma.user.findUnique({
          where: { login: credentials.login },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        const banned = await redis.get(`blacklist:${user.id}`);
        if (banned) return null;

        return { id: String(user.id), name: user.login, role: user.role };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId && session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        
        const banned = await redis.get(`blacklist:${token.userId}`);
        session.user.isBanned = !!banned;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  pages: {
    signIn: "/register",
  },
};
