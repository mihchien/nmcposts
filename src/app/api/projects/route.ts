import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, content, category, tags, github, demo, coverImage, featured, published } = body;

  if (!title || !description || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
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

  return NextResponse.json(project, { status: 201 });
}
