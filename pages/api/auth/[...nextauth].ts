import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prisma";
import { Session, User } from "@prisma/client";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
  callbacks: {
    // @ts-ignore
    session: async ({ session, user }) => {
      return {
        ...session,
        user: user,
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};