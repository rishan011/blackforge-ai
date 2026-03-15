import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        // [Placeholder for real authentication logic]
        // For now, we allow sign-in if credentials are provided
        if (credentials?.email && credentials?.password) {
          return { id: credentials.email, email: credentials.email, name: credentials.email.split("@")[0] };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await upsertUser({
          id: user.email, // Use email as ID for simplicity in this schema
          email: user.email,
          name: user.name || user.email.split("@")[0]
        });
      }
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
