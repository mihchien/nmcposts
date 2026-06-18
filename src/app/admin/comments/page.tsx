import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import CommentActions from "./CommentActions";
import Link from "next/link";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;

  const where = filter === "approved"
    ? { approved: true }
    : filter === "pending"
    ? { approved: false }
    : {};

  const comments = await prisma.comment.findMany({
    where,
    include: { post: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = await prisma.comment.count({ where: { approved: false } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Comments</h1>
          {pendingCount > 0 && (
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-0.5">
              ⏳ {pendingCount} comment{pendingCount !== 1 ? "s" : ""} pending review
            </p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/comments?filter=${f.value}` : "/admin/comments"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (filter || "") === f.value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {comments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {comments.map((comment) => (
              <div key={comment.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-750">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {comment.name ? comment.name[0].toUpperCase() : "A"}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {comment.name || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-600">→</span>
                      <Link href={`/posts/${comment.post.slug}`} target="_blank"
                        className="text-sm text-blue-500 hover:underline truncate max-w-xs">
                        {comment.post.title}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${comment.approved ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"}`}>
                        {comment.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                      {comment.content}
                    </p>
                    <time className="text-xs text-slate-400">{formatDate(comment.createdAt)}</time>
                  </div>
                  <CommentActions id={comment.id} approved={comment.approved} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-slate-400">No comments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
