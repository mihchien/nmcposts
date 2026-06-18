"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectData {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  github?: string;
  demo?: string;
  coverImage?: string;
  featured?: boolean;
  published?: boolean;
}

const CATEGORIES = ["Personal", "Education", "Robotics", "Arduino", "Students"];

export default function ProjectForm({ project }: { project?: ProjectData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    content: project?.content || "",
    category: project?.category || CATEGORIES[0],
    tags: project?.tags?.join(", ") || "",
    github: project?.github || "",
    demo: project?.demo || "",
    coverImage: project?.coverImage || "",
    featured: project?.featured || false,
    published: project?.published || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!project?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const url = isEditing ? `/api/projects/${project!.id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project name <span className="text-red-500">*</span></label>
        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Project name"
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description <span className="text-red-500">*</span></label>
        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short description of the project"
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Detailed content</label>
        <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Detailed description of the project..."
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white resize-y" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category <span className="text-red-500">*</span></label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma-separated)</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Python, Arduino, AI..."
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub URL</label>
          <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
            placeholder="https://github.com/..."
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Demo URL</label>
          <input type="url" value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover image (URL)</label>
        <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Featured ⭐</span>
        </label>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm">
          {saving ? "Saving..." : isEditing ? "Update" : "Add Project"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
