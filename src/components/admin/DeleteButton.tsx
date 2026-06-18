"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
  type,
  label = "Delete",
}: {
  id: number;
  type: "post" | "project" | "category" | "resource";
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pathMap: Record<string, string> = {
    post: "/api/posts",
    project: "/api/projects",
    category: "/api/categories",
    resource: "/api/resources",
  };

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${pathMap[type]}/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors"
    >
      {loading ? "..." : label}
    </button>
  );
}
