import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">← Projects</Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
