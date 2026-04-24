import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connect } from "@/dbconfig/dbconfig";
import Users from "@/models/users.models";

function usernameFromEmail(email: string) {
  return email.split("@")[0] || "user";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await Users.findOne({ email });
        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        if (!user.authProviders?.includes("credentials")) {
          await Users.updateOne(
            { _id: user._id },
            { $addToSet: { authProviders: "credentials" } }
          );
        }

        return {
          id: String(user._id),
          name: user.username,
          email: user.email,
          image: user.avatar || undefined,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      await connect();

      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const googleId = account.providerAccountId;
      const displayName = user.name?.trim() || usernameFromEmail(email);

      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        await Users.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              googleId: existingUser.googleId || googleId,
              avatar: user.image || existingUser.avatar || null,
              isEmailVerified: true,
            },
            $addToSet: { authProviders: "google" },
          }
        );
      } else {
        await Users.create({
          username: displayName,
          email,
          password: null,
          googleId,
          avatar: user.image || null,
          authProviders: ["google"],
          isEmailVerified: true,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (user && "role" in user && typeof user.role === "string") {
        token.role = user.role;
      }

      if (token.email && typeof token.role !== "string") {
        await connect();
        const existingUser = await Users.findOne({
          email: String(token.email).toLowerCase(),
        }).select("role");
        token.role = existingUser?.role === "admin" ? "admin" : "user";
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET,
};
