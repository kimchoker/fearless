"use client";

import { useState } from "react";
import { ref, push, update } from "firebase/database";
import { getDatabaseInstance } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const [step, setStep] = useState(1);
  const [teamRed, setTeamRed] = useState("");
  const [teamBlue, setTeamBlue] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  
  const handleCreateSession = async () => {
    if (!teamRed || !teamBlue || !nickname) {
      alert("모든 정보를 입력해주세요!");
      return;
    }

    try {
      const database = getDatabaseInstance(); // 여기서 안전하게 가져옴
      const sessionsRef = ref(database, "sessions");
      const newSessionRef = push(sessionsRef);
      const sessionId = newSessionRef.key;

      if (!sessionId) throw new Error("Session ID 생성 실패");

      // 초기 세션 데이터 설정
      const initialSessionData = {
        phase: "waiting",
        turn: 0,
        teams: {
          red: {
            name: teamRed,
            players: [
              { key: "8", nickname: "", connected: false },
              { key: "9", nickname: "", connected: false },
              { key: "12", nickname: "", connected: false },
              { key: "17", nickname: "", connected: false },
              { key: "20", nickname: "", connected: false },
            ],
          },
          blue: {
            name: teamBlue,
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

      router.push(`/links/${sessionId}`);
    } catch (error) {
      console.error("세션 생성 중 오류가 발생했습니다:", error);
      alert("세션 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center font-gong">
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={() => router.push("/settings")}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition"
        >
          Settings
        </button>
        <button
          onClick={() => router.push("/fearless")}
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
        >
          Fearless
        </button>
      </div>

      {step === 1 && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-2xl text-center mb-6">팀 이름 설정</h2>
          <input
            type="text"
            value={teamRed}
            onChange={(e) => setTeamRed(e.target.value)}
            placeholder="레드 팀 이름"
            className="w-full mb-4 p-3 rounded border border-gray-500 text-black"
          />
          <input
            type="text"
            value={teamBlue}
            onChange={(e) => setTeamBlue(e.target.value)}
            placeholder="블루 팀 이름"
            className="w-full mb-4 p-3 rounded border border-gray-500 text-black"
          />
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-500 py-3 rounded text-lg hover:bg-blue-600 transition"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-2xl text-center mb-6">닉네임 설정</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="w-full mb-4 p-3 rounded border border-gray-500 text-black"
          />
          <button
            onClick={handleCreateSession}
            className="w-full bg-green-500 py-3 rounded text-lg hover:bg-green-600 transition"
          >
            세션 생성
          </button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
