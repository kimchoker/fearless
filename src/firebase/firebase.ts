"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let database: Database | null = null;

// Firebase 초기화 함수
const initializeFirebase = (): void => {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } else if (!database) {
    const app = getApp();
    database = getDatabase(app);
  }
};

// 클라이언트 환경에서 Firebase 초기화
if (typeof window !== "undefined") {
  initializeFirebase();
}

// Named export로 Database 반환 함수
export const getDatabaseInstance = (): Database => {
  if (!database && typeof window !== "undefined") {
    initializeFirebase();
  }
  if (!database) {
    throw new Error("Firebase database has not been initialized.");
  }
  return database;
};

export default getDatabaseInstance();
