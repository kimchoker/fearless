"use client";
import { useState } from "react";
import { ref, push, update } from "firebase/database";
import database from "@/firebase/firebase";

export default function MainPage() {
  const [redTeamName, setRedTeamName] = useState("");
  const [blueTeamName, setBlueTeamName] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async () => {
    if (!redTeamName || !blueTeamName || !nickname) return;

    const sessionsRef = ref(database, "sessions");
    const newSessionRef = push(sessionsRef); // 고유 세션 ID 생성
    const sessionId = newSessionRef.key;

    await update(newSessionRef, {
      phase: "waiting",
      turn: 0,
      teams: {
        red: { name: redTeamName, players: [] },
        blue: { name: blueTeamName, players: [] },
      },
      spectators: [],
      banSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
      pickSlots: { red: [null, null, null, null, null], blue: [null, null, null, null, null] },
      bannedChampions: [],
      pickedChampions: [],
    });

    // 링크 페이지로 이동
    window.location.href = `/links/${sessionId}`;
  };

  return (
    <div className="flex flex-col justify-center items-center px-2 font-gong text-black bg-gray-700 h-[100%]">
      <h1>팀 및 닉네임 설정</h1>
      <input
        type="text"
        placeholder="레드 팀 이름"
        value={redTeamName}
        onChange={(e) => setRedTeamName(e.target.value)}
      />
      <input
        type="text"
        placeholder="블루 팀 이름"
        value={blueTeamName}
        onChange={(e) => setBlueTeamName(e.target.value)}
      />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleSubmit}>확인</button>
    </div>
  );
}
