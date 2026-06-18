import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { category: true, comments: { where: { approved: false } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, categoryId, coverImage, published, featured } = body;

  if (!title || !excerpt || !content || !categoryId) {
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
      categoryId: parseInt(categoryId),
      coverImage: coverImage || null,
      published: !!published,
      featured: !!featured,
    },
    include: { category: true },
  });

  return NextResponse.json(post, { status: 201 });
}
