"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const StartPage = () => {
  const [teamRed, setTeamRed] = useState("");
  const [teamBlue, setTeamBlue] = useState("");
  // const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleCreateSession = async () => {
    if (!teamRed || !teamBlue) {
      alert("모든 정보를 입력해주세요!");
      return;
    }

    try {
      console.log("팀 정보:", { teamRed, teamBlue }); // 입력 데이터 로그

      // 백엔드 API 호출
      const response = await axios.post("/api/session", {
        teamRed,
        teamBlue,
      });

      console.log("API 호출 응답 상태 코드:", response.status); // 상태 코드 확인

      if (response.status !== 201) {
        console.error("API 호출 실패:", response.data.error); // 오류 메시지 출력
        throw new Error(response.data.error || "세션 생성 실패");
      }

      const { sessionId } = response.data;
      console.log("세션 생성 성공, 세션 ID:", sessionId); // 성공 메시지와 세션 ID

      // 세션 생성 후 이동
      router.push(`/links/${sessionId}`);
    } catch (error) {
      console.error("세션 생성 중 오류가 발생했습니다:", error);
      alert("세션 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center font-gong">
      <div className=" w-[90%] max-w-md">
        <h2 className="text-2xl text-center mb-6">팀 이름을 입력해주세요</h2>
        <input
          type="text"
          value={teamRed}
          onChange={(e) => setTeamRed(e.target.value)}
          placeholder="RED"
          className="w-full mb-4 p-3 rounded border border-gray-500 text-red-700"
        />
        <input
          type="text"
          value={teamBlue}
          onChange={(e) => setTeamBlue(e.target.value)}
          placeholder="BLUE"
          className="w-full mb-4 p-3 rounded border border-gray-500 text-blue-700"
        />
        {/* <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
          className="w-full mb-4 p-3 rounded border border-gray-500 text-black"
        /> */}
        <button
          onClick={handleCreateSession}
          className="w-full bg-green-500 py-3 rounded text-lg hover:bg-green-600 transition"
        >
          링크 만들기
        </button>
      </div>
    </div>
  );
};

export default StartPage;
