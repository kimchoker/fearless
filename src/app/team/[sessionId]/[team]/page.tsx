'use client';

import React, { use } from "react";
import { useState, useEffect } from "react";
import { ref, onValue, update, get } from "firebase/database";
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
  // 밴픽 순서 키(player 정보 안에 있는 key) 0:{nickname: "" connected: false, key:"7"} 의
  const [playerKey, setPlayerKey] = useState("");

  // player 참가 순서 key player: [0:{...}, 1:{...}...] 의 0, 1
  const [idxKey, setIdxKey] = useState("");

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
        router.push(`/banpick/${sessionId}/${playerKey}`);
      }
    });

    return () => unsubscribe();
  }, [sessionId, router]);



  const handleSetNickname = async () => {
    if (!nickname) return;
  
    // 닉네임 중복 체크
    if (existingNicknames.includes(nickname)) {
      alert("이미 참여한 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }
  
    const playersRef = ref(database, `sessions/${sessionId}/teams/${team}/players`);
  
    try {
      // players 데이터 가져오기
      const snapshot = await get(playersRef);
  
      if (snapshot.exists()) {
        const players = snapshot.val();
  
        // 닉네임이 비어있는 첫 번째 인덱스를 찾기
        const emptyIndex = Object.keys(players).find(
          (key) => players[key].nickname === ""
        );
  
        if (emptyIndex !== undefined) {
          // 닉네임 업데이트
          await update(ref(database, `sessions/${sessionId}/teams/${team}/players/${emptyIndex}`), {
            nickname
          });
          
          // 업데이트된 데이터 가져오기
          const updatedSnapshot = await get(
            ref(database, `sessions/${sessionId}/teams/${team}/players/${emptyIndex}`)
          );
  
          if (updatedSnapshot.exists()) {
            const updatedPlayer = updatedSnapshot.val();
            const playerKey = updatedPlayer.key;
            console.log("내 닉네임이 업데이트된 키:", playerKey);
            console.log("업데이트된 플레이어 데이터:", updatedPlayer);
            setIdxKey(emptyIndex);
            setPlayerKey(playerKey);
          }
        } else {
          alert("참여 가능한 자리가 없습니다.");
        }
      } else {
        alert("플레이어 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("플레이어 데이터를 업데이트하는 중 오류가 발생했습니다:", error);
    }
  };

  const handleReady = async () => {
    if (!idxKey) return;

    try {
      // 준비 완료 상태로 업데이트
      await update(ref(database, `sessions/${sessionId}/teams/${team}/players/${idxKey}`), {
        connected: true,
      });
      setIsReady(true); // 준비 상태로 설정
    } catch (error) {
      alert(`준비 중 오류가 발생했습니다: ${error}`);
    }
  };
  
  

  return (
    <div className="bg-gray-700 flex flex-col justify-center items-center min-h-screen font-gong text-white">
      <h1 className={`text-3xl font-bold ${team === "red" ? "text-red-500" : "text-blue-500"} mb-8`}>
        {team === "red" ? "레드 팀 참가" : "블루 팀 참가"}
      </h1>
      <h2>
        닉네임을 입력한 뒤 &apos;닉네임 설정 완료&apos; 버튼,
      </h2>
      <h2 className="mb-3">
      밴픽 준비가 완료된 뒤에 &apos;밴픽 준비 완료&apos; 버튼을 눌러주세요
      </h2>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="text-black border border-gray-300 rounded px-4 py-2 w-80 mb-4"
          disabled={playerKey !== ""} // 준비 상태일 경우 입력 비활성화
        />
        <button
          onClick={handleSetNickname}
          className={`px-6 py-3 rounded font-bold text-white mb-4 ${
            !!playerKey
              ? "bg-gray-500 cursor-not-allowed"
              : nickname
              ? team === "red"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={!!playerKey || !nickname} // 닉네임이 설정되었거나 입력이 없을 경우 비활성화
        >
          닉네임 설정 완료
        </button>
        <button
          onClick={handleReady}
          className={`px-6 py-3 rounded font-bold text-white ${
            isReady
              ? "bg-green-500 cursor-not-allowed"
              : playerKey
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={isReady} // 준비 상태이거나 닉네임이 설정되지 않았을 경우 비활성화
        >
          {isReady ? "시작 대기 중" : "밴픽 준비 완료"}
        </button>
      </div>
    </div>
  );
}
