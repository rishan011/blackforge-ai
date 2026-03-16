import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return { id: credentials.email, email: credentials.email, name: credentials.email.split("@")[0] };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub || token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
