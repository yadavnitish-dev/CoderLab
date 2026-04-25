import { PrismaClient } from "../src/generated/prisma/index.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateBoilerplates } from "./seeders/boilerplateGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("Starting NeetCode 150 Seed Process...");

  // 1. Create an Admin User to own the problems
  const adminEmail = "admin@algoprep.com";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "AlgoPrep System",
        isVerified: true,
      },
    });
    console.log(`Created System Admin User: ${admin.id}`);
  }

  // 2. Load the JSON Data
  const dataPath = path.join(__dirname, "seeders", "data", "neetcode150.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const problems = JSON.parse(rawData);

  console.log(`Found ${problems.length} problems to seed.`);

  // 3. Process and Insert
  for (const p of problems) {
    // Check if problem already exists
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`Skipping: ${p.title} (Already exists)`);
      continue;
    }

    // Generate Boilerplates
    const codeSnippets = generateBoilerplates(p.functionSignature);

    // Insert
    await prisma.problem.create({
      data: {
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        tags: p.tags,
        userId: admin.id,
        examples: p.examples,
        constraints: p.constraints,
        hints: p.hints,
        testcases: p.testcases,
        codeSnippets: codeSnippets,
        referenceSolutions: p.referenceSolutions,
      },
    });

    console.log(`Seeded: [0x${Math.floor(Math.random()*1000).toString(16).toUpperCase()}_SUCCESS] ${p.title}`);
  }

  console.log("Seed process completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
