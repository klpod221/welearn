import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import api from "@/lib/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data } = await api.post("/auth/login", {
          username: credentials.username,
          password: credentials.password,
        });

        if (data && data.user) {
          return {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            accessToken: data.token,
            role: data.user.role, // Lưu thêm role vào user
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token = {
          ...token,
          accessToken: user.accessToken,
          id: user.id,
          username: user.username,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        username: token.username,
        role: token.role,
      };

      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
