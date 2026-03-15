import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@blackforge.ai" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          // Identify explicitly mocked Google profile
          if (credentials.email === "google-demo@blackforge.ai") {
            return { id: "google-mock-1", name: "Google Account", email: "google-demo@blackforge.ai", image: "https://lh3.googleusercontent.com/a/default-user" };
          }
          // The standard email fallback
          if (credentials.email === "demo@blackforge.ai" && credentials.password === "demo") {
            return { id: "1", name: "Demo User", email: "demo@blackforge.ai" };
          }
          // Accept any dummy login for testing
          return { id: "99", name: credentials.email.split("@")[0], email: credentials.email };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: "blackforge-ai-dummy-secret-key-123456", // Set NEXTAUTH_SECRET in production
});

export { handler as GET, handler as POST };
