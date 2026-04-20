import { Response } from "express";

/**
 * Cookie Utility
 * Centralized logic for setting the JWT authentication cookie
 */
export const setCookie = (res: Response, token: string): void => {
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const clearCookie = (res: Response): void => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
