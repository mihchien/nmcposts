"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/posts", label: "Posts", icon: "📝" },
  { href: "/admin/comments", label: "Comments", icon: "💬" },
  { href: "/admin/projects", label: "Projects", icon: "🚀" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
];

export default function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-blue-600 dark:text-blue-400 text-lg">
            ⚙️ Admin
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            👤 {adminName}
          </span>
          <Link href="/" target="_blank" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
            View site
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-sm font-medium transition-colors"
          >
            {loggingOut ? "..." : "Logout"}
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 flex overflow-x-auto">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-2 text-xs transition-colors ${
              pathname === item.href
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-slate-500"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
