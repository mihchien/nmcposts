import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, comments: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, excerpt, content, categoryId, coverImage, published, featured } = body;

  const existing = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  if (title !== existing.title) {
    slug = slugify(title);
    const conflict = await prisma.post.findFirst({ where: { slug, id: { not: parseInt(id) } } });
    if (conflict) slug = `${slug}-${Date.now()}`;
  }

  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title,
      slug,
      excerpt,
      content,
      categoryId: parseInt(categoryId),
      coverImage: coverImage || null,
      published: !!published,
      featured: !!featured,
    },
    include: { category: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
