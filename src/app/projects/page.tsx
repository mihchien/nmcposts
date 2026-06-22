import { prisma } from "@/lib/prisma";
import { getProjectDisplayCategory, getProjectGradient } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Personal, education, robotics and Arduino projects",
};

const PROJECT_CATEGORIES = [
  "All", "Personal", "Education", "Students",
];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const allProjects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const projects = category && category !== "All"
    ? allProjects.filter((p) => {
        const mapped = getProjectDisplayCategory(p.category);
        return mapped === category || p.category === category;
      })
    : allProjects;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Projects</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Personal, education, robotics, Arduino and student projects
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {PROJECT_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/projects" : `/projects?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (cat === "All" && !category) || category === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const tags = JSON.parse(project.tags || "[]") as string[];
            const displayCategory = getProjectDisplayCategory(project.category);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className={`aspect-video bg-gradient-to-br ${getProjectGradient(displayCategory)} relative`}>
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                      {project.category === "Robotics" ? "🦾" : project.category === "Arduino" ? "⚡" : project.category === "Học sinh" ? "👨‍🎓" : "🚀"}
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {displayCategory}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-end">
                    <div className="flex gap-2">
                      {project.github && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">GitHub</span>
                      )}
                      {project.demo && (
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Demo</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-5xl mb-4">🚀</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No projects yet</p>
          <p className="text-slate-400 text-sm mt-1">Projects will be added soon</p>
        </div>
      )}
    </div>
  );
}
