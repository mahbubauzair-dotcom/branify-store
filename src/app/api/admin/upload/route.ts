import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * POST /api/admin/upload
 *
 * Accepts multipart/form-data with a `file` field. Returns the file as a
 * base64 data URL so the admin panel can store it directly in the database
 * (e.g. as a product image). Limited to 5MB and a small allow-list of
 * image MIME types.
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : "";
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { ok: false, error: "Expected multipart/form-data." },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "A `file` field is required." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "The uploaded file is empty." },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { ok: false, error: "File is too large. Maximum size is 5MB." },
        { status: 413 },
      );
    }

    const ext = getExtension(file.name);
    const mime = ALLOWED[ext] || (file.type && Object.values(ALLOWED).includes(file.type) ? file.type : "");
    if (!mime) {
      return NextResponse.json(
        { ok: false, error: "Unsupported file type. Allowed: png, jpg, jpeg, webp, gif, svg." },
        { status: 415 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ ok: true, url: dataUrl });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/upload] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
