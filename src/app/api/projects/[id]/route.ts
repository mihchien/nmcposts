import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, description, content, category, tags, github, demo, coverImage, featured, published } = body;

  const existing = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  if (title !== existing.title) {
    slug = slugify(title);
    const conflict = await prisma.project.findFirst({ where: { slug, id: { not: parseInt(id) } } });
    if (conflict) slug = `${slug}-${Date.now()}`;
  }

  const project = await prisma.project.update({
    where: { id: parseInt(id) },
    data: {
      title, slug, description,
      content: content || null,
      category,
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
      github: github || null,
      demo: demo || null,
      coverImage: coverImage || null,
      featured: !!featured,
      published: !!published,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
