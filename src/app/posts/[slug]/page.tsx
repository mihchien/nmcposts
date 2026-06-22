import { prisma } from "@/lib/prisma";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "./CommentSection";
import ShareButtons from "./ShareButtons";
import type { Metadata } from "next";
import { renderMarkdown } from "@/lib/markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { categories: true },
  });
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      categories: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) notFound();

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      categories: { some: { id: { in: post.categories.map((c) => c.id) } } },
      id: { not: post.id },
    },
    include: { categories: true },
    take: 3,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-blue-500">Posts</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat) => (
            <span key={cat.id} className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(cat.slug)}`}>
              {cat.name}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">NMC</div>
            <span>Nguyễn Minh Chiến</span>
          </div>
          <span>·</span>
          <span>{post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* Share buttons */}
      <div className="mb-8">
        <ShareButtons title={post.title} />
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-slate-200 dark:bg-slate-700">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <article
        className="prose dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: await renderMarkdown(post.content) }}
      />

      {/* Tags */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-t border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex flex-wrap gap-2">
          {post.categories.map((cat) => (
            <Link key={cat.id} href={`/posts?category=${cat.slug}`}
              className={`text-sm font-medium px-3 py-1 rounded-full ${getCategoryColor(cat.slug)}`}>
              #{cat.name}
            </Link>
          ))}
        </div>
        <ShareButtons title={post.title} />
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} comments={post.comments} />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <Link key={related.id} href={`/posts/${related.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                <div className="flex flex-wrap gap-1">
                  {related.categories.map((cat) => (
                    <span key={cat.id} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(cat.slug)}`}>
                      {cat.name}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-2 text-sm line-clamp-2">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
