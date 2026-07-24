/**
 * Seed script — creates/updates the admin user + categories + site settings.
 *
 * Runs automatically during `bun run build` (Vercel deployment) and can be
 * run manually: `bun run seed`
 *
 * The admin password is embedded in this file so deployments always have
 * a working admin login without manual setup.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./admin-auth";
import { readFileSync } from "fs";
import { resolve } from "path";

/** Resolve DATABASE_URL — prefer process.env, fall back to .env file. */
function getDatabaseUrl(): string {
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;
  try {
    const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
    const match = content.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
      const url = match[1].trim().replace(/^["']|["']$/g, "");
      if (url.startsWith("postgres")) return url;
    }
  } catch {
    /* ignore */
  }
  return env ?? "";
}

const DATABASE_URL = getDatabaseUrl();

async function main() {
  const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
  });

  // 1. Create or update admin user
  const adminEmail = "admin@branify.store";
  const adminPassword = "mahbuba1213";
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  const passwordHash = await hashPassword(adminPassword);
  if (!existing) {
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash, name: "BRANIFY Admin", role: "superadmin" },
    });
    console.log(`✓ Admin user created: ${adminEmail}`);
  } else {
    // Always update the password to ensure it matches the embedded one.
    await prisma.adminUser.update({
      where: { email: adminEmail },
      data: { passwordHash },
    });
    console.log(`✓ Admin user password updated: ${adminEmail}`);
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

main()
  .then(() => process.exit(0))
  .catch((e) => {
    // Don't fail the build — log a warning so Vercel deployment succeeds
    // even if the DB is briefly unreachable. Admin can re-run seed manually.
    console.warn("⚠️  Seed warning (non-fatal):", e.message);
    console.warn("   The app will still deploy. Run `bun run seed` manually later.");
    process.exit(0);
  });
