"use client";

import React, { use, useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import database from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { Player } from "@/types/types";

export default function LinksPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();

  const blueTeamLink = `${typeof window !== "undefined" ? window.location.origin : ""}/team/${sessionId}/blue`;
  const redTeamLink = `${typeof window !== "undefined" ? window.location.origin : ""}/team/${sessionId}/red`;
  const spectatorLink = `${typeof window !== "undefined" ? window.location.origin : ""}/spectator/${sessionId}`;

  const [copyStatus, setCopyStatus] = useState({
    blue: false,
    red: false,
    spectator: false,
  });

  const [blueTeamPlayers, setBlueTeamPlayers] = useState<string[]>(Array(5).fill("대기 중"));
  const [redTeamPlayers, setRedTeamPlayers] = useState<string[]>(Array(5).fill("대기 중"));

  useEffect(() => {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
  
      if (data) {
        const bluePlayers = Array.isArray(data.teams?.blue?.players)
          ? data.teams.blue.players
          : (Object.values(data.teams?.blue?.players || {}) as Player[]).map(
              (player) => player.nickname || "대기 중"
            );
  
        const redPlayers = Array.isArray(data.teams?.red?.players)
          ? data.teams.red.players
          : (Object.values(data.teams?.red?.players || {}) as Player[]).map(
              (player) => player.nickname || "대기 중"
            );
  
        setBlueTeamPlayers([...bluePlayers]);
        setRedTeamPlayers([...redPlayers]);
      }
    });
  
    return () => unsubscribe();
  }, [sessionId]);
  

  useEffect(() => {
    const statusRef = ref(database, `sessions/${sessionId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.isStarted) {
        router.push(`/banpick/${sessionId}`);
      }
    });

    return () => unsubscribe();
  }, [sessionId, router]);

  const copyToClipboard = (text: string, key: "blue" | "red" | "spectator") => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyStatus((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: false })), 2000);
      },
      () => console.error("복사에 실패했습니다.")
    );
  };

  const isAllReady = blueTeamPlayers.every((player) => player !== "대기 중") &&
                     redTeamPlayers.every((player) => player !== "대기 중");

  const handleStartBanPick = () => {
    if (isAllReady) {
      update(ref(database, `sessions/${sessionId}/status`), { isStarted: true });
    }
  };

  return (
    <div className="bg-gray-700 flex flex-col justify-center items-center font-gong min-h-screen">
      <h1 className="text-white text-2xl mb-4">참가 링크</h1>

      {/* 블루 팀 링크 */}
      <div className="link-container mb-6 w-[90%] max-w-2xl">
        <label className="text-white mb-2 block">블루 팀 링크:</label>
        <div className="flex">
          <input
            type="text"
            value={blueTeamLink}
            readOnly
            className="flex-1 px-4 py-2 text-black rounded border border-gray-300"
          />
          <button
            onClick={() => copyToClipboard(blueTeamLink, "blue")}
            className={`ml-2 px-4 py-2 rounded whitespace-nowrap ${
              copyStatus.blue ? "bg-green-500 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {copyStatus.blue ? "복사 성공!" : "복사"}
          </button>
        </div>
      </div>

      {/* 레드 팀 링크 */}
      <div className="link-container mb-6 w-[90%] max-w-2xl">
        <label className="text-white mb-2 block">레드 팀 링크:</label>
        <div className="flex">
          <input
            type="text"
            value={redTeamLink}
            readOnly
            className="flex-1 px-4 py-2 text-black rounded border border-gray-300"
          />
          <button
            onClick={() => copyToClipboard(redTeamLink, "red")}
            className={`ml-2 px-4 py-2 rounded whitespace-nowrap ${
              copyStatus.red ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {copyStatus.red ? "복사 성공!" : "복사"}
          </button>
        </div>
      </div>

      {/* 관전자 링크 */}
      <div className="link-container mb-6 w-[90%] max-w-2xl">
        <label className="text-white mb-2 block">관전자 링크:</label>
        <div className="flex">
          <input
            type="text"
            value={spectatorLink}
            readOnly
            className="flex-1 px-4 py-2 text-black rounded border border-gray-300"
          />
          <button
            onClick={() => copyToClipboard(spectatorLink, "spectator")}
            className={`ml-2 px-4 py-2 rounded whitespace-nowrap ${
              copyStatus.spectator ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {copyStatus.spectator ? "복사 성공!" : "복사"}
          </button>
        </div>
      </div>

      {/* 참가 현황 */}
      <div className="mt-4 text-white w-[90%] max-w-2xl">
        <h2 className="text-lg mb-4">참가 현황</h2>
        <div className="flex justify-between">
          {/* 블루 팀 현황 */}
          <div>
            <h3 className="text-blue-500 mb-2">블루 팀</h3>
            <ul className="list-disc pl-6">
              {blueTeamPlayers.map((player, idx) => (
                <li key={`blue-${idx}`}>{player}</li>
              ))}
            </ul>
          </div>

          {/* 레드 팀 현황 */}
          <div>
            <h3 className="text-red-500 mb-2">레드 팀</h3>
            <ul className="list-disc pl-6">
              {redTeamPlayers.map((player, idx) => (
                <li key={`red-${idx}`}>{player}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 밴픽 시작 버튼 */}
      <button
        onClick={handleStartBanPick}
        disabled={!isAllReady}
        className={`mt-8 px-6 py-3 rounded ${
          isAllReady ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        밴픽 시작하기
      </button>
    </div>
  );
}
