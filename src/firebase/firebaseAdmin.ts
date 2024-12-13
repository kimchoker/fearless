import admin, { ServiceAccount } from "firebase-admin";

let adminDb: admin.database.Database | null = null;

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    privateKey: (process.env.PRIVATE_KEY! as string).replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL!,
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

