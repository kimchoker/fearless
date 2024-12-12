import admin from "firebase-admin";

let adminDb: admin.database.Database | null = null;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "{}");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });

  adminDb = admin.database();
} else {
  adminDb = admin.app().database();
}

export default adminDb;
