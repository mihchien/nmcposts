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

export const PROJECT_CATEGORY_MAP: Record<string, string> = {
  "Cá nhân": "Personal",
  "Giáo dục": "Education",
  "Robotics": "Robotics",
  "Arduino": "Arduino",
  "Học sinh": "Students",
};

export function getProjectDisplayCategory(category: string) {
  return PROJECT_CATEGORY_MAP[category] || category;
}

export const PROJECT_CATEGORY_GRADIENTS: Record<string, string> = {
  Personal: "from-blue-500 to-indigo-600",
  Education: "from-emerald-500 to-green-600",
  Robotics: "from-rose-500 to-red-600",
  Arduino: "from-teal-500 to-cyan-600",
  Students: "from-violet-500 to-purple-600",
};

export function getProjectGradient(category: string) {
  return PROJECT_CATEGORY_GRADIENTS[category] || "from-slate-500 to-slate-700";
}

export const PROJECT_CATEGORY_COLORS: Record<string, string> = {
  Personal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Education: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Robotics: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  Arduino: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Students: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
};

export function getProjectCategoryColor(category: string) {
  return (
    PROJECT_CATEGORY_COLORS[category] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
}
