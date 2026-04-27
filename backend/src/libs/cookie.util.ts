import { Response } from "express";

type SameSite = "strict" | "lax" | "none";

/**
 * Cookie Utility
 * Centralized logic for setting the JWT authentication cookie
 */
export const setAuthCookies = (res: Response, token: string, refreshToken: string, sameSite: SameSite = "strict"): void => {
  const isProduction = process.env.NODE_ENV === "production";

  // Access Token - Short lived
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  // Refresh Token - Long lived
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const setCookie = (res: Response, token: string, sameSite: SameSite = "strict"): void => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearCookie = (res: Response): void => {
  const options = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };

  res.clearCookie("jwt", options);
  res.clearCookie("refreshToken", options);
};
