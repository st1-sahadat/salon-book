import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

// Avatar files are stored in MongoDB so they survive server restarts and
// deployments (the local filesystem is read-only on most hosts).
export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function hasValidSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return buffer.length > signature.length && signature.every((byte, index) => buffer[index] === byte);
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length > 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

// POST /api/upload/avatar - Upload a profile image and return its public URL
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    const file = formData?.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file was provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Choose a JPG, PNG or WEBP image." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The selected image is empty." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!hasValidSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "The file does not look like a valid image." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("uploads").insertOne({
      kind: "avatar",
      contentType: file.type,
      extension: ALLOWED_TYPES.get(file.type),
      size: buffer.length,
      // Base64 keeps the driver from having to promote BSON binary values.
      data: buffer.toString("base64"),
      createdAt: new Date(),
    });

    return NextResponse.json(
      { url: `/api/uploads/${result.insertedId.toString()}` },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Could not upload your photo. Please try again." },
      { status: 500 }
    );
  }
}
