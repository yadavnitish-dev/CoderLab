import express, { Request, Response } from "express";
import passport from "../libs/passport.js";
import { generateToken } from "../libs/jwt.util.js";
import { setCookie } from "../libs/cookie.util.js";

const router = express.Router();

/**
 * OAuth Routes
 * Handles Google and GitHub authentication flows
 */

// --- Google Auth ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const user = req.user as any;
    const token = generateToken(user.id);
    setCookie(res, token);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// --- GitHub Auth ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const user = req.user as any;
    const token = generateToken(user.id);
    setCookie(res, token);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

export default router;
