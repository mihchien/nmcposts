import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { categories: true, comments: { where: { approved: false } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, categoryIds, coverImage, published, featured } = body;

  if (!title || !excerpt || !content || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(title);
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      categories: { connect: categoryIds.map((id: number) => ({ id: parseInt(String(id)) })) },
      coverImage: coverImage || null,
      published: !!published,
      featured: !!featured,
    },
    include: { categories: true },
  });

  return NextResponse.json(post, { status: 201 });
}
