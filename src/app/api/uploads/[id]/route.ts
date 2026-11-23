import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/uploads/[id] - Serve an uploaded avatar
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { db } = await connectToDatabase();
    const upload = await db.collection("uploads").findOne({
      _id: new ObjectId(id),
    });

    if (!upload?.data) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = Buffer.from(upload.data as string, "base64");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": (upload.contentType as string) || "application/octet-stream",
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    console.error("Error serving upload:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
