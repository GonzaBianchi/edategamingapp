import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "discord") return false;
      try {
        await connectDB();
        const discordProfile = profile as { id: string; username: string; avatar: string | null };
        const avatarUrl = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        await User.findOneAndUpdate(
          { discordId: discordProfile.id },
          {
            $setOnInsert: {
              discordId: discordProfile.id,
              username: discordProfile.username,
              avatar: avatarUrl,
              onboardingComplete: false,
            },
          },
          { upsert: true, new: true }
        );
        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      // Primera vez que inicia sesión: poblar el token con datos de la DB
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as { id: string };
        await connectDB();
        const dbUser = await User.findOne({ discordId: discordProfile.id }).lean();
        if (dbUser) {
          token.userId = (dbUser._id as string).toString();
          token.discordId = discordProfile.id;
          token.onboardingComplete = dbUser.onboardingComplete;
        }
      }

      // Mientras onboardingComplete sea false, re-leer de la DB en cada request
      // Esto permite que el token se actualice luego de completar el onboarding
      if (token.userId && !token.onboardingComplete) {
        await connectDB();
        const dbUser = await User.findById(token.userId).select("onboardingComplete").lean();
        if (dbUser?.onboardingComplete) {
          token.onboardingComplete = true;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.discordId = token.discordId as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Extensión de tipos NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingComplete: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    discordId: string;
    onboardingComplete: boolean;
  }
}
