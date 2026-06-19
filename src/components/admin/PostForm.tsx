"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PostData {
  id?: number;
  title?: string;
  excerpt?: string;
  content?: string;
  categoryIds?: number[];
  coverImage?: string;
  published?: boolean;
  featured?: boolean;
}

export default function PostForm({
  categories,
  post,
}: {
  categories: Category[];
  post?: PostData;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    featured: post?.featured || false,
  });
  const [categoryIds, setCategoryIds] = useState<number[]>(
    post?.categoryIds && post.categoryIds.length > 0
      ? post.categoryIds
      : categories[0]
        ? [categories[0].id]
        : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const isEditing = !!post?.id;

  function toggleCategory(id: number) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      const markdown = `\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n`;
      setForm((f) => ({ ...f, content: f.content + markdown }));
      setUploadMsg(`✅ Inserted: ${url}`);
    } else {
      const d = await res.json();
      setUploadMsg(`❌ ${d.error}`);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (categoryIds.length === 0) {
      setError("Select at least one category");
      return;
    }

    setSaving(true);

    try {
      const url = isEditing ? `/api/posts/${post!.id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categoryIds }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short description shown in post listings..."
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs text-slate-400">Supports Markdown: **bold**, *italic*, # heading, - list, `code`, &gt; blockquote, ![caption](url)</p>
              <label className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${uploading ? "bg-slate-100 text-slate-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"}`}>
                {uploading ? "Uploading..." : "📷 Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {uploadMsg && <p className="text-xs mb-2 text-slate-500">{uploadMsg}</p>}
            <textarea
              required
              rows={20}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write post content (Markdown supported)..."
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm font-mono resize-y"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Settings</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Categories / Tags <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const selected = categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400"
                      }`}
                    >
                      #{cat.name}
                    </button>
                  );
                })}
              </div>
              {categoryIds.length === 0 && (
                <p className="text-xs text-red-500 mt-1.5">Select at least one category</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Cover image (URL)
              </label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Featured ⭐</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
