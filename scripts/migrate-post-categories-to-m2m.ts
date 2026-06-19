import { createClient } from "@libsql/client";

const DDL = `
CREATE TABLE "_CategoryToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Post" ("content", "coverImage", "createdAt", "excerpt", "featured", "id", "published", "slug", "title", "updatedAt") SELECT "content", "coverImage", "createdAt", "excerpt", "featured", "id", "published", "slug", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");
`;

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !url.startsWith("libsql://")) throw new Error("Set TURSO_DATABASE_URL to the remote libsql:// URL");
  if (!authToken) throw new Error("Set TURSO_AUTH_TOKEN");

  const client = createClient({ url, authToken });

  const before = await client.execute(`SELECT id, categoryId FROM Post`);
  const mapping = before.rows.map((r) => ({ postId: Number(r.id), categoryId: Number(r.categoryId) }));
  console.log(`Captured ${mapping.length} post → category mappings from production`);

  await client.executeMultiple(DDL);
  console.log("✓ Schema migrated: dropped Post.categoryId, created _CategoryToPost join table");

  for (const { postId, categoryId } of mapping) {
    await client.execute({
      sql: `INSERT INTO "_CategoryToPost" ("A", "B") VALUES (?, ?)`,
      args: [categoryId, postId],
    });
  }
  console.log(`✓ Re-linked ${mapping.length} posts to their original category via the join table`);

  const postCount = await client.execute(`SELECT COUNT(*) as c FROM Post`);
  const joinCount = await client.execute(`SELECT COUNT(*) as c FROM _CategoryToPost`);
  console.log(`Verify: Post rows = ${postCount.rows[0].c}, _CategoryToPost rows = ${joinCount.rows[0].c}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
