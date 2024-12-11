'use client'
import { ref, set, getDatabase } from "firebase/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSession = async (sessionData: any) => {
  const db = getDatabase();
  const sessionId = Date.now().toString(); // 고유 ID 생성
  const sessionRef = ref(db, `sessions/${sessionId}`);
  await set(sessionRef, {
    ...sessionData,
    status: "waiting",
    banpickData: {},
  });
  return sessionId;
};
