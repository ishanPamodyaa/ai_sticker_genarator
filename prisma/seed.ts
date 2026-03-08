import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  // Upsert admin user (idempotent)
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin@1234";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN", name: "Admin" },
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user upserted: ${adminEmail} / ${adminPassword}`);

  // Upsert sample templates
  const templates = [
    {
      name: "Cute Animals",
      description: "Adorable animal stickers with bold outlines",
      status: "ACTIVE" as const,
      provider: "mock",
      modelName: "mock-v1",
      basePrompt:
        "A cute kawaii sticker, bold black outline, chibi style, vibrant colors, minimal white background",
      negativePrompt: "blurry, low quality, distorted, realistic",
      width: 1024,
      height: 1024,
      sampleCount: 4,
      tags: ["cute", "animals", "kawaii"],
    },
    {
      name: "Space Explorer",
      description: "Space-themed stickers with rockets and planets",
      status: "ACTIVE" as const,
      provider: "mock",
      modelName: "mock-v1",
      basePrompt:
        "A fun space-themed sticker, bold outline, sticker style, vibrant colors on white background",
      negativePrompt: "blurry, low quality, photorealistic",
      width: 1024,
      height: 1024,
      sampleCount: 4,
      tags: ["space", "rockets", "fun"],
    },
  ];

  for (const t of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.template.create({ data: t });
      console.log(`Template '${t.name}' created`);
    } else {
      console.log(`Template '${t.name}' already exists`);
    }
  }

  console.log("Seed complete!");
}

main().catch(console.error);
