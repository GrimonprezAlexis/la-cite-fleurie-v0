import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    //const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCCWqmGAcYtxd7d\nF+ujdw7eVebITKry8FBTTtOcrx/ugUEE7R3nNd436e1fwun4NfhPqeM5xPjxXDQC\nEhDHzXkcESNfgl/Mn2/25pcdC1SA0vNzNzuK0FbwasaA4sRN+ln4Hvatkb/+lT3T\n3jW7IdAWi8at4BAIJjaKc0ihZrJ+oxf6yOIeSw7bGC9u/knHpbaODrfbXqB8KVwd\npoIlqvwK9PQ12rC6ULumGD0mXGkOSIwXkBgLvN4t7z975eujTXi1nkhrMwZVhtWF\nc5cOgrZnbXB3/A3CQ18N+CiW5IcVmgklKePG4aY6vDREkpVDg+nPj+jzjNKu6sOJ\nalTlWZcpAgMBAAECggEAAZJCNOFUmDyoYRXmu0O2JCv46jUyYldPQJHUrzDVO7TH\nKd4J3D2j/hyNxfe9hkZwRdWQbaPYNGCeJ+A734y0hwgV2xLhQMAzQ1CoRatbS2o/\nkQX7a8LzKVbAKdGR+DaqWvlUk+cL32/BHQqyrxzLO1pX/MSUrOR5B9Y36+onAKvG\nOL8vdbD3g0Hl00/790MWL7qVy6JgdGlLZ4baAhGi25GnqZ9JoDbNHWcZ152kLrfp\nbwDk4teU7OmCz3081J5FP/b1U6lECvfG1F2oaF5W4oYgZ4Hzk/Kr4NvyvJCQ+HsT\nASkJWvbUJ8UHAoIc1pOAVUiE055j0wYR71opVe7iYQKBgQC31saAU0AS+buMkZB+\nStP+YN9jTxZW8xT9RJGMuEYsDiLtMNOyG7vrI1J5Kb3Cwyg/iiGfWaIRGEzyYH8r\niWZPjN/N6oDWu+LTv/7+ZL5H9lvBY6HbDCDWGodPRXiO6WHweXrWcibfpBzLar+C\n5pTxEh26UqKFrOeiEuoaY6u4fQKBgQC1hWqozNlWirUTPg7CAqKWNgIeCU9jNEJy\nBl2yX+Yh5+pBlT75mJwpPA8+5M6sqGwT3vxxAQV9NT/hMreo0PV2NP2S7gh6tEVz\nJJGCnoHrPtZn6CqI8QgE4/FNz2EaLswHvncl9WYo5+ZyuQ5Cv1W5nrWMjwWzmQ3W\neGn4XpxFHQKBgB737zhuzbxklVN4sf6UXGHdr8Pq7rh2+nIvutUZtbh2KSwLrZ2z\nTlSt/paqkWzds0oA2ukdEFAQ5+Vsm/+ZhcKg2JK3jjyeKffBwBLapbM5rPtG7V0Z\nDe8DSQfxi/2HExiPXkIBuMqzuqYJtXk3np99jcR1ZytdlSeYSBdp8uOBAoGAB7pE\nTidaYUrKZqVPr4a5MTffYzP2QzzoTz5iIsPeYjcjS+N0qN+MVl0OMRlAiy0oXLgz\newQWHbx0mbu1AeTTblLXMLgdeEvQYRR/dVYWJdOpAQdrOCU6uCqUDUH02k5/tRyw\nqdcGoFsu/ldOehz3I03UYMV98qVjZ2v85uvwLykCgYEAqBCI4/2qViH3nmQGAVkO\nHl93bbn99XWWNE9vAasa44DHyOtW1EQlQNdXuJI5T0Fm1MlzTUeU3mVjR/+DmT6b\nlKdFljzTpQfUVeAofvq9Xr4LJuBEwYJmQONHWVmDnD8KAN2GK5HponAG3YKMXRrI\nFIVouKBnkyLmLzXyBpoq4cc=\n-----END PRIVATE KEY-----\n";

    if (process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && privateKey) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey,
        }),
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

let adminDb: Firestore | null = null;

try {
  adminDb = getApps().length ? getFirestore() : null;
} catch (error) {
  console.error('Firestore initialization error:', error);
  adminDb = null;
}

export { adminDb };
