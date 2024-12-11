import { ref, update, onValue } from "firebase/database";
import database from "./firebase";

// 팀에 참가하는 함수
export async function joinTeam(sessionId, team, nickname) {
  const teamRef = ref(database, `sessions/${sessionId}/${team}`);
  await update(teamRef, { [nickname]: true });
}

// 세션 구독 함수
export function subscribeToSession(sessionId, callback) {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return unsubscribe;
}
