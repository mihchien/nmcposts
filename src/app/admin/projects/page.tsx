import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
          🚀 Add Project
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {projects.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-750">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">{project.title}</span>
                    {project.featured && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">⭐</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400">{project.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.published ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                      {project.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(project.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/projects/${project.id}`}
                    className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors">
                    Edit
                  </Link>
                  <DeleteButton id={project.id} type="project" label="Delete" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🚀</p>
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Link href="/admin/projects/new" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
              Add your first project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
