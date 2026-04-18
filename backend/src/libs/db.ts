import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

db.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error: unknown) => {
    console.error("Database connection failed:", error);
  });