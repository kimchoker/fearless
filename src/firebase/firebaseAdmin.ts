import admin, { ServiceAccount } from "firebase-admin";

let adminDb: admin.database.Database | null = null;

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"), // Vercel 형식에 맞춰 \n 변환
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  });
  console.log("Firebase Admin Apps:", admin.apps.length);
  adminDb = admin.database();
} else {
  adminDb = admin.app().database();
}

export default adminDb;
