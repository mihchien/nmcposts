import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import Link from "next/link";

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          ← Posts
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">New Post</h1>
      </div>
      {categories.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 text-center">
          <p className="text-yellow-700 dark:text-yellow-400 mb-3">You need to create at least one category before writing a post.</p>
          <Link href="/admin/categories/new" className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">
            Create a category
          </Link>
        </div>
      ) : (
        <PostForm categories={categories} />
      )}
    </div>
  );
}
