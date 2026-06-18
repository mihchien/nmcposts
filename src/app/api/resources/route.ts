import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const resources = await prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, url, fileUrl, category, type, published } = body;

  if (!title || !description || !category || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const resource = await prisma.resource.create({
    data: {
      title, description,
      url: url || null,
      fileUrl: fileUrl || null,
      category, type,
      published: !!published,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
