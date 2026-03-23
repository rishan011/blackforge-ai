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
        await upsertUser({
          email: user.email,
          name: user.name || user.email.split("@")[0]
        });
        return true;
      } catch (error) {
        console.error("[NextAuth] DB Sync failed, but allowing login to proceed:", error);
        return true; 
      }
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  logger: {
    error(code, metadata) {
      console.error("[NextAuth Error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth Warn]", code);
    },
    debug(code, metadata) {
      console.log("[NextAuth Debug]", code, metadata);
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
