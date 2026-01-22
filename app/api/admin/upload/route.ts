import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;

    if (!file || !key) {
      return NextResponse.json({ error: 'File and key are required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bucket = process.env.AWS_S3_BUCKET;

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
    }));

    const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
