import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Passport Configuration
 * Manages Google and GitHub OAuth strategies
 */

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found from Google profile"));
        }

        // 1. Find user by googleId
        let user = await db.user.findUnique({
          where: { googleId: profile.id },
        });

        // 2. If not found by googleId, check by email
        if (!user) {
          user = await db.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link existing email account to Google
            user = await db.user.update({
              where: { email },
              data: { googleId: profile.id, image: user.image || profile.photos?.[0].value },
            });
          } else {
            // 3. Create new user
            user = await db.user.create({
              data: {
                email,
                name: profile.displayName,
                googleId: profile.id,
                image: profile.photos?.[0].value,
                password: null, // No password for OAuth users
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "dummy",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/v1/auth/github/callback",
      proxy: true,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0].value;
        // GitHub might not provide email depending on user settings
        if (!email) {
          return done(new Error("No public email found from GitHub profile"));
        }

        let user = await db.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await db.user.findUnique({
            where: { email },
          });

          if (user) {
            user = await db.user.update({
              where: { email },
              data: { githubId: profile.id, image: user.image || profile.photos?.[0].value },
            });
          } else {
            user = await db.user.create({
              data: {
                email,
                name: profile.displayName || profile.username,
                githubId: profile.id,
                image: profile.photos?.[0].value,
                password: null,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
