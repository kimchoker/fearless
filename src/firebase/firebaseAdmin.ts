import admin, { ServiceAccount } from "firebase-admin";

let adminDb: admin.database.Database | null = null;
if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
  console.error("FIREBASE_ADMIN_PROJECT_ID is missing");
}
if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
  console.error("FIREBASE_ADMIN_CLIENT_EMAIL is missing");
}
if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error("FIREBASE_ADMIN_PRIVATE_KEY is missing");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
  console.error("NEXT_PUBLIC_FIREBASE_DATABASE_URL is missing");
}

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY! as string).replace(/\\n/g, "\n"),
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

