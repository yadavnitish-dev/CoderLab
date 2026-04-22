import { vi } from "vitest";

export const db = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  problem: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  submission: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  testCaseResult: {
    createMany: vi.fn(),
    findMany: vi.fn(),
  },
  $queryRaw: vi.fn(),
  $connect: vi.fn().mockResolvedValue(undefined),
};
