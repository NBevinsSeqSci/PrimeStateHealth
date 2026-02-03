import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/brevo";
import bcrypt from "bcryptjs";

const normalizeAuthEnv = () => {
  const explicitUrl = process.env.NEXTAUTH_URL || process.env.APP_URL;
  if (explicitUrl) {
    if (!process.env.NEXTAUTH_URL) {
      process.env.NEXTAUTH_URL = explicitUrl;
    }
    if (!process.env.APP_URL) {
      process.env.APP_URL = explicitUrl;
    }
    return;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (!vercelUrl) {
    return;
  }

  const baseUrl = vercelUrl.startsWith("http")
    ? vercelUrl
    : `https://${vercelUrl}`;

  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = baseUrl;
  }

  if (!process.env.APP_URL) {
    process.env.APP_URL = baseUrl;
  }
};

normalizeAuthEnv();

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: { host: "unused", port: 0, auth: { user: "", pass: "" } },
      from: "noreply@primestatehealth.com",
      async sendVerificationRequest({ identifier, url }) {
        const host = new URL(url).host;
        await sendMagicLinkEmail({
          email: identifier,
          url,
          host,
        });
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = (credentials?.identifier as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;

        if (!identifier || !password) return null;

        // Look up user by email (we can add username support later)
        const user = await prisma.user.findFirst({
          where: {
            email: identifier,
          },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? "",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Changed from "database" to support credentials
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // Look up terms acceptance on first sign-in
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { acceptedTermsAt: true },
        });
        token.acceptedTermsAt = dbUser?.acceptedTermsAt?.toISOString() ?? null;
      }
      // Refresh terms status when session is updated
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { acceptedTermsAt: true },
        });
        token.acceptedTermsAt = dbUser?.acceptedTermsAt?.toISOString() ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.acceptedTermsAt = (token.acceptedTermsAt as string) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
