import { prisma } from "../src/lib/prisma";

const NEW_CATEGORIES = [
  { name: "AI", slug: "ai" },
  { name: "Python", slug: "python" },
  { name: "Swift", slug: "swift" },
  { name: "Robotics", slug: "robotics" },
  { name: "Arduino", slug: "arduino" },
  { name: "Tool", slug: "tool" },
  { name: "Teaching Tips", slug: "teaching-tips" },
  { name: "Education", slug: "education" },
  { name: "Developer Game", slug: "developer-game" },
  { name: "STEAM", slug: "steam" },
];

async function main() {
  // Get existing categories
  const existing = await prisma.category.findMany();
  console.log("Existing categories:", existing.map(c => c.slug));

  // Upsert each new category
  for (const cat of NEW_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    console.log(`✓ ${cat.name} (${cat.slug})`);
  }

  // Find old categories not in new list, only delete if no posts use them
  const newSlugs = NEW_CATEGORIES.map(c => c.slug);
  const toRemove = existing.filter(c => !newSlugs.includes(c.slug));

  for (const cat of toRemove) {
    const postCount = await prisma.post.count({ where: { categoryId: cat.id } });
    if (postCount === 0) {
      await prisma.category.delete({ where: { id: cat.id } });
      console.log(`✗ Removed old category: ${cat.name}`);
    } else {
      console.log(`⚠ Kept "${cat.name}" — ${postCount} post(s) still use it`);
    }
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
