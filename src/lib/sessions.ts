import { ref, set, onValue, update, getDatabase } from "firebase/database";
import database from "@/firebase/firebase";
import { SessionData } from "@/types/types";


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

export const subscribeToSession = (sessionId: string, callback: (data: any) => void) => {
  const db = getDatabase();
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe; // 구독 해제 함수 반환
};

export const updateSessionParticipants = async (sessionId: string, team: "red" | "blue" | "spectator", nickname: string) => {
  const sessionRef = ref(database, `sessions/${sessionId}/participants/${team}`);
  await set(sessionRef, { [nickname]: true }); // 닉네임 추가
};