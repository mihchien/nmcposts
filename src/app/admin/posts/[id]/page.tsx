import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: parseInt(id) } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          ← Posts
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">{post.title}</h1>
      </div>
      <PostForm categories={categories} post={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.categoryId,
        coverImage: post.coverImage || "",
        published: post.published,
        featured: post.featured,
      }} />
    </div>
  );
}
