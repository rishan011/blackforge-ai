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
      if (!user.email) return false;
      
      try {
        // Sync user to Supabase
        await upsertUser({
          email: user.email,
          name: user.name || user.email.split("@")[0]
        });
        return true;
      } catch (error) {
        console.error("[NextAuth] DB Sync failed, but allowing login to proceed:", error);
        // Important: We return true so the user can still log in even if our DB sync has a hiccup
        return true; 
      }
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        (session.user as any).id = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Force debug logs in production to find the OAuthCallback cause
});

export { handler as GET, handler as POST };
