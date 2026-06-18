import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">← Projects</Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">{project.title}</h1>
      </div>
      <ProjectForm project={{
        id: project.id,
        title: project.title,
        description: project.description,
        content: project.content || "",
        category: project.category,
        tags: JSON.parse(project.tags || "[]"),
        github: project.github || "",
        demo: project.demo || "",
        coverImage: project.coverImage || "",
        featured: project.featured,
        published: project.published,
      }} />
    </div>
  );
}
