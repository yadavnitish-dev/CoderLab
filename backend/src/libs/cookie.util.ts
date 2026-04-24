import { Response } from "express";

/**
 * Cookie Utility
 * Centralized logic for setting the JWT authentication cookie
 */
export const setAuthCookies = (res: Response, token: string, refreshToken: string): void => {
  // Access Token - Short lived
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  // Refresh Token - Long lived
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const setCookie = (res: Response, token: string): void => {
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearCookie = (res: Response): void => {
  const options = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV !== "development",
  };
  
  res.clearCookie("jwt", options);
  res.clearCookie("refreshToken", options);
};
