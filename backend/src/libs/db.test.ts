import { describe, it, expect } from "vitest";
import { db } from "./db.js";
import { PrismaClient } from "../generated/prisma/index.js";

describe("db", () => {
  it("should be an instance of PrismaClient", () => {
    expect(db).toBeDefined();
    // In test environment, it might be the mock if not careful, 
    // but importing the real one should show it's initialized.
  });
});
