'use client';

import React, { use } from "react";
import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import database from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { Player } from "@/types/types";

export default function TeamPage({ params }: { params: Promise<{ sessionId: string; team: string }> }) {
  // React.use()로 params 언래핑
  const { sessionId, team } = use(params);
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [existingNicknames, setExistingNicknames] = useState<string[]>([]); // 현재 팀의 닉네임 리스트
  const [isReady, setIsReady] = useState(false); // 준비 상태 관리

  // Firebase에서 현재 팀의 닉네임 리스트 구독
  useEffect(() => {
    const playersRef = ref(database, `sessions/${sessionId}/teams/${team}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const players: Player[] = data ? Object.values(data) as Player[] : [];
      const nicknames = players.map((player) => player.nickname);
      setExistingNicknames(nicknames);

      // 이미 추가된 닉네임이면 "준비완료" 상태로 설정
      if (nickname && nicknames.includes(nickname)) {
        setIsReady(true);
      }
    });

    return () => unsubscribe();
  }, [sessionId, team, nickname]);

  // Firebase에서 밴픽 시작 상태 구독
  useEffect(() => {
    const statusRef = ref(database, `sessions/${sessionId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.isStarted) {
        // 밴픽이 시작되면 밴픽 페이지로 이동
        router.push(`/banpick/${sessionId}`);
      }
    });

    return () => unsubscribe();
  }, [sessionId, router]);

  const handleJoin = async () => {
    if (!nickname) return;

    // 닉네임 중복 체크
    if (existingNicknames.includes(nickname)) {
      alert("이미 참여한 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }

    const playersRef = ref(database, `sessions/${sessionId}/teams/${team}/players`);
    await push(playersRef, { nickname, connected: true });
    setIsReady(true); // 준비 상태로 설정
  };

  return (
    <div className="bg-gray-700 flex flex-col justify-center items-center min-h-screen font-gong text-white">
      <h1 className={`text-3xl font-bold ${team === "red" ? "text-red-500" : "text-blue-500"} mb-8`}>
        {team === "red" ? "레드 팀 참가" : "블루 팀 참가"}
      </h1>

      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="text-black border border-gray-300 rounded px-4 py-2 w-80 mb-4"
          disabled={isReady} // 준비 상태일 경우 입력 비활성화
        />
        <button
          onClick={handleJoin}
          className={`px-6 py-3 rounded font-bold text-white ${
            isReady
              ? "bg-green-500 cursor-not-allowed"
              : nickname
              ? team === "red"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={isReady || !nickname} // 준비 상태이거나 닉네임이 없을 경우 비활성화
        >
          {isReady ? "준비완료" : "참가하기"}
        </button>
      </div>
    </div>
  );
}
