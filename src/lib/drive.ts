import { SignJWT, importPKCS8 } from "jose";

/**
 * Google Drive 1TB Storage Vault Connector
 * Uploads, streams, and shares files directly within the user's 1TB Google Drive folder
 * using a free Google Cloud Service Account.
 */
export interface DriveUploadResult {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink?: string;
  webContentLink?: string;
  directUrl: string;
}

/**
 * Exchange Service Account private key for a Google OAuth2 Access Token
 */
async function getDriveAccessToken(): Promise<string | null> {
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL || process.env.GCS_CLIENT_EMAIL;
  let privateKey = process.env.GDRIVE_PRIVATE_KEY || process.env.GCS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle escaped newlines in env variables
  privateKey = privateKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const parsedKey = await importPKCS8(privateKey, "RS256");

  const jwt = await new SignJWT({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(parsedKey);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error("[Google Drive] Failed to exchange Service Account token:", errText);
    return null;
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

/**
 * Upload a file directly to the user's shared 1TB Google Drive folder
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string = "application/octet-stream"
): Promise<DriveUploadResult> {
  const token = await getDriveAccessToken();
  const folderId = process.env.GDRIVE_FOLDER_ID; // The ID of the shared 1TB folder in Google Drive

  if (!token) {
    throw new Error(
      "Google Drive Service Account credentials not found. Configure GDRIVE_CLIENT_EMAIL and GDRIVE_PRIVATE_KEY in .env.local."
    );
  }

  // Multipart upload metadata
  const metadata = {
    name: fileName,
    mimeType,
    parents: folderId ? [folderId] : undefined,
  };

  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody = Buffer.concat([
    Buffer.from(
      delimiter +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n`
    ),
    Buffer.from(buffer.toString("base64")),
    Buffer.from(closeDelimiter),
  ]);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": multipartRequestBody.length.toString(),
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Drive upload failed (${res.status}): ${err}`);
  }

  const data = await res.json();

  // Make file readable to anyone with link (optional for CDN delivery)
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone",
      }),
    });
  } catch {
    // Non-fatal if permission change fails
  }

  return {
    fileId: data.id,
    name: data.name,
    mimeType: data.mimeType,
    size: parseInt(data.size || "0", 10),
    webViewLink: data.webViewLink,
    webContentLink: data.webContentLink,
    directUrl: `https://lh3.googleusercontent.com/d/${data.id}`,
  };
}
