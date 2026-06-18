import { prisma } from "@/lib/prisma";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts",
  description: "Articles about AI, Programming, Robotics and STEAM Education",
};

const PAGE_SIZE = 9;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const categorySlug = params.category || "";
  const page = parseInt(params.page || "1");

  const where = {
    published: true,
    ...(q && {
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
      ],
    }),
    ...(categorySlug && { category: { slug: categorySlug } }),
  };

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Posts</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Sharing knowledge about AI, Programming, Robotics and STEAM Education
        </p>
      </div>

      {/* Search & Filter */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
        <select
          name="category"
          defaultValue={categorySlug}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        >
          <option value="">All topics</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
          Search
        </button>
        {(q || categorySlug) && (
          <Link href="/posts" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-center">
            Clear
          </Link>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/posts"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!categorySlug ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/posts?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categorySlug === cat.slug ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Results info */}
      {(q || categorySlug) && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Found <strong>{total}</strong> article{total !== 1 ? "s" : ""}{q && ` for "${q}"`}{categorySlug && ` in "${categories.find(c => c.slug === categorySlug)?.name}"`}
        </p>
      )}

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                    {post.category.slug === "ai" ? "🤖" : post.category.slug === "programming" ? "💻" : post.category.slug === "robotics" ? "🦾" : "📚"}
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${getCategoryColor(post.category.slug)}`}>
                  {post.category.name}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No articles found</p>
          <Link href="/posts" className="mt-4 inline-block text-blue-500 hover:underline">View all posts</Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/posts?${new URLSearchParams({ ...(q && { q }), ...(categorySlug && { category: categorySlug }), page: String(page - 1) })}`}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 transition-colors text-sm">
              ← Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/posts?${new URLSearchParams({ ...(q && { q }), ...(categorySlug && { category: categorySlug }), page: String(p) })}`}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${p === page ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400"}`}>
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={`/posts?${new URLSearchParams({ ...(q && { q }), ...(categorySlug && { category: categorySlug }), page: String(page + 1) })}`}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 transition-colors text-sm">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
