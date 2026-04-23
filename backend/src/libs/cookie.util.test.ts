import { describe, it, expect, vi } from "vitest";
import { setCookie, clearCookie } from "./cookie.util.js";
import { Response } from "express";

describe("cookie.util", () => {
  it("should set jwt cookie with correct options", () => {
    const res = {
      cookie: vi.fn(),
    } as unknown as Response;

    setCookie(res, "mock-token");

    expect(res.cookie).toHaveBeenCalledWith("jwt", "mock-token", expect.objectContaining({
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }));
  });

  it("should clear jwt cookie", () => {
    const res = {
      clearCookie: vi.fn(),
    } as unknown as Response;

    clearCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith("jwt", expect.objectContaining({
      httpOnly: true,
      sameSite: "strict",
    }));
  });
});
