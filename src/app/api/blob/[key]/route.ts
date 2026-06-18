import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const store = getStore("uploads");
  const blob = await store.get(key, { type: "arrayBuffer" });

  if (!blob) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ext = key.split(".").pop()?.toLowerCase() || "";
  return new NextResponse(blob, {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
