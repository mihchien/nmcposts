"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentActions({
  id,
  approved,
}: {
  id: number;
  approved: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !approved }),
    });
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    if (!confirm("Delete this comment?")) return;
    setLoading(true);
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={toggle}
        disabled={loading}
        className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
          approved
            ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100"
            : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100"
        }`}
      >
        {loading ? "..." : approved ? "Unapprove" : "✅ Approve"}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
