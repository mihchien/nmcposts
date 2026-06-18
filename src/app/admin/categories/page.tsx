import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{categories.length} categor{categories.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Link href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
          🏷️ New Category
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {categories.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-750">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">{cat.name}</div>
                  <div className="text-xs text-slate-400">/{cat.slug} · {cat._count.posts} post{cat._count.posts !== 1 ? "s" : ""}</div>
                </div>
                <DeleteButton id={cat.id} type="category" label="Delete" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-slate-400 mb-4">No categories yet</p>
            <Link href="/admin/categories/new" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
              Create your first category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
