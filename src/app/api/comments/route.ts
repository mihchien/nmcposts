import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SPAM_KEYWORDS = ["casino", "poker", "viagra", "cialis", "loan", "click here", "earn money"];

function isSpam(content: string): boolean {
  const lower = content.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, name, content } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (content.trim().length < 10) {
      return NextResponse.json({ error: "Comment must be at least 10 characters." }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: "Comment must not exceed 1000 characters." }, { status: 400 });
    }

    if (isSpam(content)) {
      return NextResponse.json({ error: "Your comment was rejected due to inappropriate content." }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId, published: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        name: name?.trim()?.slice(0, 50) || null,
        content: content.trim(),
        approved: false,
      },
    });

    return NextResponse.json({ success: true, id: comment.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
