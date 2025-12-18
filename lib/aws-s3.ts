import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(file: File, key: string) {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function deleteFileFromS3(key: string) {
  const params = {
    Bucket: BUCKET,
    Key: key,
  };
  await s3.send(new DeleteObjectCommand(params));
}
