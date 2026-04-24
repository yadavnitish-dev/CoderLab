import express, { Request, Response } from "express";
import passport from "../libs/passport.js";
import { authService } from "../services/index.js";
import { setAuthCookies } from "../libs/cookie.util.js";

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
    authService.loginSocial(user).then((result) => {
      if (result.refreshToken) {
        setAuthCookies(res, result.token, result.refreshToken);
      }
      res.redirect(`${process.env.FRONTEND_URL}/roadmap`);
    }).catch((err) => {
      console.error("OAuth Login Error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    });
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
    authService.loginSocial(user).then((result) => {
      if (result.refreshToken) {
        setAuthCookies(res, result.token, result.refreshToken);
      }
      res.redirect(`${process.env.FRONTEND_URL}/roadmap`);
    }).catch((err) => {
      console.error("OAuth Login Error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    });
  }
);

export default router;
