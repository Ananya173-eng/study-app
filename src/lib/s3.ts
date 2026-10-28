import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

// Load S3 / S3-compatible credentials from environment
const S3_BUCKET = process.env.S3_BUCKET || '';
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const S3_ENDPOINT = process.env.S3_ENDPOINT || ''; // E.g. Cloudflare R2, MinIO, or Supabase S3
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || '';
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || '';
const S3_PUBLIC_URL_PREFIX = process.env.S3_PUBLIC_URL_PREFIX || '';

const isS3Configured = Boolean(
  S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
);

// Initialize S3 Client (compatible with AWS S3, Cloudflare R2, MinIO, Supabase S3, etc.)
let s3Client: S3Client | null = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(S3_ENDPOINT), // Required for MinIO and local testing
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });
}

export interface UploadResult {
  key: string;
  url: string;
  isS3: boolean;
}

/**
 * Upload a file to S3-compatible storage or resilient local fallback
 */
export async function uploadToStorage(params: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  userId: string;
}): Promise<UploadResult> {
  const sanitizedName = params.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueKey = `users/${params.userId}/materials/${Date.now()}-${sanitizedName}`;

  if (s3Client && isS3Configured) {
    try {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: uniqueKey,
        Body: params.buffer,
        ContentType: params.contentType,
      });

      await s3Client.send(command);

      let publicUrl = '';
      if (S3_PUBLIC_URL_PREFIX) {
        publicUrl = `${S3_PUBLIC_URL_PREFIX}/${uniqueKey}`;
      } else if (S3_ENDPOINT) {
        publicUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${uniqueKey}`;
      } else {
        publicUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${uniqueKey}`;
      }

      return {
        key: uniqueKey,
        url: publicUrl,
        isS3: true,
      };
    } catch (err) {
      console.warn('S3 upload failed, falling back to local storage:', err);
    }
  }

  // Resilient Local Storage Fallback: Saves file to public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', params.userId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const localFileName = `${Date.now()}-${sanitizedName}`;
  const filePath = path.join(uploadDir, localFileName);
  fs.writeFileSync(filePath, params.buffer);

  return {
    key: `local/${params.userId}/${localFileName}`,
    url: `/uploads/${params.userId}/${localFileName}`,
    isS3: false,
  };
}

/**
 * Generate a presigned download URL for secure S3 object access
 */
export async function getDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  if (s3Client && isS3Configured && !key.startsWith('local/')) {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (err) {
      console.warn('Failed to generate presigned S3 URL:', err);
    }
  }

  // If local or fallback
  if (key.startsWith('local/')) {
    const parts = key.replace('local/', '');
    return `/uploads/${parts}`;
  }

  return '';
}

/**
 * Delete a file from S3-compatible storage or local storage
 */
export async function deleteFromStorage(key: string): Promise<boolean> {
  if (s3Client && isS3Configured && !key.startsWith('local/')) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
      await s3Client.send(command);
      return true;
    } catch (err) {
      console.warn('Failed to delete object from S3:', err);
      return false;
    }
  }

  if (key.startsWith('local/')) {
    try {
      const parts = key.replace('local/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', parts);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (err) {
      console.warn('Failed to delete local file:', err);
      return false;
    }
  }

  return true;
}
