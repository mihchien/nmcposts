export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const CATEGORY_COLORS: Record<string, string> = {
  ai: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  python: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  swift: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  robotics: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  arduino: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  tool: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
  "teaching-tips": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  education: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "developer-game": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  steam: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

export function getCategoryColor(slug: string) {
  return (
    CATEGORY_COLORS[slug] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
}
