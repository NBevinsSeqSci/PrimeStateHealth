import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/brevo";

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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        const host = new URL(url).host;
        await sendMagicLinkEmail({
          email: identifier,
          url,
          host,
        });
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
