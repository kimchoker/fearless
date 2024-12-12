"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const StartPage = () => {
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
      // 백엔드 API 호출
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamRed, teamBlue }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "세션 생성 실패");
      }

      const { sessionId } = await response.json();

      // 세션 생성 후 이동
      router.push(`/links/${sessionId}`);
    } catch (error) {
      console.error("세션 생성 중 오류가 발생했습니다:", error);
      alert("세션 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center font-gong">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-2xl text-center mb-6">팀 정보 입력</h2>
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
    </div>
  );
};

export default StartPage;
