import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    // Логин через логин + пароль
    CredentialsProvider({
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        // Ищем юзера в БД по логину
        const user = await prisma.user.findUnique({
          where: { login: credentials.login },
        });

        if (!user) return null;

        // Сравниваем введённый пароль с хэшем из БД
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // Возвращаем объект — он попадёт в JWT токен
        return { id: String(user.id), name: user.login };
      },
    }),

    // Логин через Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Логин через GitHub
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Вызывается при создании/обновлении JWT токена
    async jwt({ token, user }) {
      // user есть только в момент логина
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    // Вызывается когда читаешь сессию через useSession / getServerSession
    async session({ session, token }) {
      // Кладём userId из токена в сессию чтобы использовать в Server Actions
      if (token.userId && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  },

  pages: {
    signIn: "/login", // страница логина (создашь позже)
  },
});

export { handler as GET, handler as POST };
