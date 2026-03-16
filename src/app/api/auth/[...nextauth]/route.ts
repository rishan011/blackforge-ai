import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
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
        // [SAFE MODE] Temporarily bypassing DB sync to isolate OAuthCallback issue
        /*
        await upsertUser({
          email: user.email,
          name: user.name || user.email.split("@")[0]
        });
        */
        return true;
      } catch (error) {
        console.error("[NextAuth] Safe-mode log:", error);
        return true; 
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub || token.id;
        (session.user as any).email = token.email;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
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
