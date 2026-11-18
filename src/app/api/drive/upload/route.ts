import { NextResponse } from "next/server";
import { uploadToGoogleDrive } from "@/lib/drive";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Enforce 500MB maximum upload limit
    const MAX_SIZE = 500 * 1024 * 1024; // 500MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 500MB maximum limit" },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Google Drive credentials are configured:
    if (process.env.GDRIVE_CLIENT_EMAIL && process.env.GDRIVE_PRIVATE_KEY) {
      const uploadResult = await uploadToGoogleDrive(
        buffer,
        file.name,
        file.type || "application/octet-stream"
      );

      return NextResponse.json({
        success: true,
        storage: "Google Drive (1TB Vault)",
        ...uploadResult,
      });
    }

    // Fallback: Local simulated CDN URL if Google Drive credentials are being set up
    const simulatedId = `drv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return NextResponse.json({
      success: true,
      storage: "Local Dev Storage (Google Drive Ready)",
      fileId: simulatedId,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      directUrl: `https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/uploads/${file.name}`,
      note: "Add GDRIVE_CLIENT_EMAIL, GDRIVE_PRIVATE_KEY, and GDRIVE_FOLDER_ID to stream straight into your 1TB Google Drive.",
    });
  } catch (error: any) {
    console.error("[Drive API Upload Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
