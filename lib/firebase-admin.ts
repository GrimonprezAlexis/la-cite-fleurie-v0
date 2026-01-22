import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let db: Firestore;

function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

export function getAdminDb(): Firestore {
  if (!db) {
    initializeFirebaseAdmin();
  }
  return db;
}
