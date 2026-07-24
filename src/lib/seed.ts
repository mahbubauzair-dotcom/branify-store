/**
 * Seed script — creates the initial admin user + categories on Neon.
 * Run: DATABASE_URL="..." node --experimental-strip-types src/lib/seed.ts
 * (or use bun: bun run src/lib/seed.ts)
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./admin-auth";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
  });

  // 1. Create admin user (if not exists)
  const adminEmail = "admin@branify.store";
  const adminPassword = "branify123"; // default password — change after first login
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash, name: "BRANIFY Admin", role: "superadmin" },
    });
    console.log(`✓ Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("✓ Admin user already exists");
  }

  // 2. Create initial categories (if not exist)
  const categories = [
    { name: "Prompts", slug: "prompts", description: "AI prompt bundles & libraries", icon: "FileText", sortOrder: 1 },
    { name: "Templates", slug: "templates", description: "Editable templates for every channel", icon: "LayoutTemplate", sortOrder: 2 },
    { name: "Kits", slug: "kits", description: "Complete design & brand kits", icon: "Package", sortOrder: 3 },
    { name: "Documents", slug: "documents", description: "Legal, ops & business documents", icon: "Briefcase", sortOrder: 4 },
    { name: "Planners", slug: "planners", description: "Digital planners & organizers", icon: "CalendarDays", sortOrder: 5 },
  ];
  for (const cat of categories) {
    const exists = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!exists) {
      await prisma.category.create({ data: { ...cat, active: true } });
      console.log(`✓ Category created: ${cat.name}`);
    } else {
      console.log(`✓ Category already exists: ${cat.name}`);
    }
  }

  // 3. Create default site settings (for the website builder)
  const defaultSettings: Record<string, string> = {
    "hero.headline": "Brands that feel like a million dollars",
    "hero.subheadline": "BRANIFY is a premium digital agency crafting world-class websites, brand identities, AI solutions and digital products. We design, build and grow brands that win.",
    "hero.primaryCtaText": "Start a project",
    "hero.secondaryCtaText": "View our work",
    "color.primary": "#0fe1d2",
    "color.hover": "#02b6bc",
    "color.background": "#0b1120",
    "color.surface": "#131c31",
    "announcement.text": "New Year Sale — Get 40% off all digital products & 15% off services.",
    "announcement.active": "true",
    "footer.tagline": "Brands that feel like a million dollars.",
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    const exists = await prisma.siteSetting.findUnique({ where: { key } });
    if (!exists) {
      await prisma.siteSetting.create({ data: { key, value } });
    }
  }
  console.log(`✓ Site settings seeded (${Object.keys(defaultSettings).length} keys)`);

  await prisma.$disconnect();
  console.log("\n✅ Seed complete!");
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
