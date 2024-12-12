'use client'
import { ref, update, onValue, push } from "firebase/database";
import database from "./firebase";

// 팀에 참가하는 함수
export async function joinTeam(sessionId: string, team: string, nickname: string) {
  const teamRef = ref(database, `sessions/${sessionId}/${team}`);
  await update(teamRef, { [nickname]: true });
}

// 세션 구독 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function subscribeToSession(sessionId: string, callback: any) {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return unsubscribe;
}


export const createSession = async (sessionData: { teamRed: string; teamBlue: string }) => {
  if (typeof window === "undefined") {
    return
  }
  const sessionsRef = ref(database, "sessions");
  const newSessionRef = push(sessionsRef); // 고유 세션 ID 생성
  const sessionId = newSessionRef.key;

  if (!sessionId) throw new Error("Session ID 생성 실패");

  // 초기 세션 데이터 설정
  const initialSessionData = {
    phase: "waiting",
    turn: 0,
    teams: {
      red: {
        name: sessionData.teamRed,
        players: [
          { key: "8", nickname: "", connected: false },
          { key: "9", nickname: "", connected: false },
          { key: "12", nickname: "", connected: false },
          { key: "17", nickname: "", connected: false },
          { key: "20", nickname: "", connected: false },
        ],
      },
      blue: {
        name: sessionData.teamBlue,
        players: [
          { key: "7", nickname: "", connected: false },
          { key: "10", nickname: "", connected: false },
          { key: "11", nickname: "", connected: false },
          { key: "18", nickname: "", connected: false },
          { key: "19", nickname: "", connected: false },
        ],
      },
    },
    spectators: [],
    banSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
    pickSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
    bannedChampions: [],
    pickedChampions: [],
  };

  // Firebase에 데이터 저장
  await update(newSessionRef, initialSessionData);

  return sessionId;
};
