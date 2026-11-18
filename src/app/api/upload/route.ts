import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";

// Max file size: 500MB (524,288,000 bytes)
const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Initialize GCS client if credentials are configured
let gcsStorage: Storage | null = null;
const bucketName = process.env.GCS_BUCKET_NAME || "tessro-cdn-assets";

if (process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY) {
  try {
    const privateKey = process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n");
    gcsStorage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  } catch (err) {
    console.error("[Tessro GCS] Initialization error:", err);
  }
}

/**
 * GET /api/upload
 * Returns CDN status, storage telemetry, and max limits
 */
export async function GET() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  let fileCount = 0;
  let totalBytes = 0;

  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    fileCount = files.length;
    for (const file of files) {
      try {
        const stats = fs.statSync(path.join(uploadsDir, file));
        totalBytes += stats.size;
      } catch {}
    }
  }

  const usedMB = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;

  return NextResponse.json({
    status: "active",
    maxFileSizeLimit: "500MB",
    maxFileSizeBytes: MAX_FILE_SIZE,
    engine: gcsStorage ? "Google Cloud Storage (1TB CDN)" : "Tessro High-Velocity Edge CDN",
    storageUsedMB: usedMB,
    filesHosted: fileCount,
    bucket: gcsStorage ? bucketName : "public/uploads",
    allowedFormats: ["image/*", "video/*", "audio/*", ".svg", ".zip", ".pdf", ".glb", ".gltf"],
  });
}

/**
 * POST /api/upload
 * High-throughput free image & asset uploader supporting up to 500MB
 */
export async function POST(req: Request) {
  try {
    const session = await getCurrentSession(req);
    const contentType = req.headers.get("content-type") || "";

    // Case 1: Presigned URL Request (JSON payload)
    if (contentType.includes("application/json")) {
      const { filename, fileType, fileSize } = await req.json();

      if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
      }

      if (fileSize && fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds the 500MB free CDN limit (${fileSize} bytes)` },
          { status: 400 }
        );
      }

      const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      if (gcsStorage) {
        const file = gcsStorage.bucket(bucketName).file(safeFilename);
        const [uploadUrl] = await file.getSignedUrl({
          version: "v4",
          action: "write",
          expires: Date.now() + 60 * 60 * 1000, // 60 mins for large 500MB uploads
          contentType: fileType || "application/octet-stream",
        });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${safeFilename}`;

        return NextResponse.json({
          uploadUrl,
          publicUrl,
          bucket: bucketName,
          status: "signed_gcs",
          maxSize: "500MB",
        });
      }

      // Edge local fallback
      const publicUrl = `/uploads/${safeFilename}`;
      return NextResponse.json({
        uploadUrl: "/api/upload",
        publicUrl,
        bucket: "local_edge_cdn",
        status: "local_edge_active",
        maxSize: "500MB",
        message: "File will be served from high-velocity edge storage up to 500MB.",
      });
    }

    // Case 2: Multipart Form-Data Direct File Upload (Streaming up to 500MB)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided in form-data" }, { status: 400 });
      }

      // Validate 500MB limit
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File exceeds 500MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB uploaded)` },
          { status: 400 }
        );
      }

      const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      // Upload to GCS if configured
      if (gcsStorage) {
        const gcsFile = gcsStorage.bucket(bucketName).file(safeFilename);
        const nodeReadable = Readable.fromWeb(file.stream() as any);
        const gcsWriteStream = gcsFile.createWriteStream({
          metadata: { contentType: file.type || "application/octet-stream" },
          resumable: file.size > 5 * 1024 * 1024, // Enable chunked resumable upload for >5MB
        });

        await pipeline(nodeReadable, gcsWriteStream);

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${safeFilename}`;
        await db.logs.log("GCS_FILE_UPLOADED", `Uploaded ${safeFilename} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, session?.id);

        return NextResponse.json({
          success: true,
          url: publicUrl,
          filename: safeFilename,
          sizeBytes: file.size,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2),
          storage: "Google Cloud Storage (1TB CDN)",
        });
      }

      // Upload to Local Edge CDN (/public/uploads) via stream
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, safeFilename);
      const nodeReadable = Readable.fromWeb(file.stream() as any);
      const fileWriteStream = fs.createWriteStream(filePath);

      await pipeline(nodeReadable, fileWriteStream);

      const publicUrl = `/uploads/${safeFilename}`;
      await db.logs.log("LOCAL_FILE_UPLOADED", `Saved ${safeFilename} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, session?.id);

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: safeFilename,
        sizeBytes: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        storage: "Tessro Free Edge CDN (up to 500MB)",
      });
    }

    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
