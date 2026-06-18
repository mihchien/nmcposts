import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [posts, pendingComments, projects, categories] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count({ where: { approved: false } }),
    prisma.project.count(),
    prisma.category.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentComments = await prisma.comment.findMany({
    include: { post: true },
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Posts", value: posts, icon: "📝", href: "/admin/posts", color: "blue" },
          { label: "Pending", value: pendingComments, icon: "⏳", href: "/admin/comments", color: "yellow", alert: pendingComments > 0 },
          { label: "Projects", value: projects, icon: "🚀", href: "/admin/projects", color: "teal" },
          { label: "Categories", value: categories, icon: "🏷️", href: "/admin/categories", color: "purple" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`bg-white dark:bg-slate-800 rounded-xl border ${stat.alert ? "border-yellow-400 dark:border-yellow-600" : "border-slate-200 dark:border-slate-700"} p-5 hover:shadow-md transition-all`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            {stat.alert && (
              <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-medium">● Needs review</div>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Posts</h2>
            <Link href="/admin/posts/new" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">
              + New Post
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{post.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{post.category.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${post.published ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/posts/${post.id}`} className="text-xs text-blue-500 hover:underline flex-shrink-0">
                  Edit
                </Link>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No posts yet</p>
            )}
          </div>
          <Link href="/admin/posts" className="mt-3 block text-xs text-center text-blue-500 hover:underline">
            View all →
          </Link>
        </div>

        {/* Pending comments */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Pending Comments</h2>
            {pendingComments > 0 && (
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                {pendingComments}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recentComments.length > 0 ? recentComments.map((comment) => (
              <div key={comment.id} className="py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {comment.name || "Anonymous"} → <span className="text-blue-500 truncate">{comment.post.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{comment.content}</p>
                  </div>
                  <Link href="/admin/comments" className="text-xs text-blue-500 hover:underline flex-shrink-0">Review</Link>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">✅ No pending comments</p>
            )}
          </div>
          <Link href="/admin/comments" className="mt-3 block text-xs text-center text-blue-500 hover:underline">
            Manage comments →
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/posts/new", label: "New Post", icon: "✍️" },
            { href: "/admin/projects/new", label: "Add Project", icon: "🚀" },
            { href: "/admin/categories/new", label: "New Category", icon: "🏷️" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-600 hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-all"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
