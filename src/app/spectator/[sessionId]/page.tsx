'use client';

import React, { useState, useEffect, use } from "react";
import { ref, onValue } from "firebase/database";
import database from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { Player } from "@/types/types";

export default function SpectatorPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();

  const [blueTeam, setBlueTeam] = useState<string[]>([]); // 블루 팀 닉네임 상태
  const [redTeam, setRedTeam] = useState<string[]>([]); // 레드 팀 닉네임 상태
  const [blueTeamName, setBlueTeamName] = useState<string>("BLUE"); // 블루 팀 이름 상태
  const [redTeamName, setRedTeamName] = useState<string>("RED"); // 레드 팀 이름 상태
	const [blueStatus, setBlueStatus] = useState<string[]>([]);
	const [redStatus, setRedStatus] = useState<string[]>([]);
  const [loadingText, setLoadingText] = useState("밴픽 시작 대기중..."); // 중앙 텍스트 상태

  // 팀 닉네임 및 이름 구독
  useEffect(() => {
    const teamsRef = ref(database, `sessions/${sessionId}/teams`);
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // 블루 팀 닉네임 및 이름 업데이트
        const bluePlayers = data.blue?.players || {};
        const blueNicknames = Object.values(bluePlayers as Record<string, Player>).map(
          (player) => player.nickname || "입장 대기 중"
        );
				const blueStatus = Object.values(bluePlayers as Record<string, Player>).map(
          (player) => player.connected ? "✔️" : "❌"
        );

        setBlueTeam(blueNicknames);
        setBlueTeamName(data.blue?.name || "BLUE");
				setBlueStatus(blueStatus);

        // 레드 팀 닉네임 및 이름 업데이트
        const redPlayers = data.red?.players || {};
        const redNicknames = Object.values(redPlayers as Record<string, Player>).map(
          (player) => player.nickname || "입장 대기 중"
        );
				const redStatus = Object.values(redPlayers as Record<string, Player>).map(
          (player) => player.connected ? "✔️" : "❌"
        );
        setRedTeam(redNicknames);
        setRedTeamName(data.red?.name || "RED");
				setRedStatus(redStatus);
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  // 밴픽 시작 상태 구독
  useEffect(() => {
    const statusRef = ref(database, `sessions/${sessionId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.isStarted) {
        // 밴픽 시작 시 이동, playerKey는 99
        router.push(`/banpick/${sessionId}/99`);
      }
    });

    return () => unsubscribe();
  }, [sessionId, router]);

  // 로딩 텍스트 애니메이션
  useEffect(() => {
    const loadingAnimation = setInterval(() => {
      setLoadingText((prev) => {
        if (prev.endsWith("...")) return "밴픽 시작 대기중.";
        if (prev.endsWith("..")) return "밴픽 시작 대기중...";
        return "밴픽 시작 대기중..";
      });
    }, 500);

    return () => clearInterval(loadingAnimation);
  }, []);

  return (
    <div className="bg-gray-700 flex flex-col justify-center items-center min-h-screen font-gong text-white">
      <div className="flex w-full max-w-5xl">
        {/* 블루 팀 닉네임 */}
				<div className="flex flex-col justify-center items-center">
					<h2 className="text-blue-500 text-5xl mb-4">{blueTeamName}</h2>
					<div className="flex flex-row items-center text-2xl">
						<div className="flex-1 flex-col items-center p-10">
							<ul className="w-full text-center p-5">
								{blueStatus.map((status, index) => (
										<li key={`blue-${index}`} className="mb-5">{status}</li>
								))}
							</ul>
						</div>
							<ul>
								{blueTeam.map((nickname, index) => (
									<li key={`blue-${index}`} className="mb-5">{nickname}</li>
								))}
							</ul>
						
					</div>
				</div>


        {/* 중앙 대기 텍스트 */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-3xl font-bold">{loadingText}</h1>
        </div>

        {/* 레드 팀 닉네임 */}
				<div className="flex flex-col justify-center items-center">
					<h2 className="text-red-500 text-5xl mb-4">{redTeamName}</h2>
					<div className="flex flex-row items-center text-2xl">
						<div className="flex-1 flex flex-col items-center p-10">
							<ul className="w-full text-center p-5">
								{redTeam.map((nickname, index) => (
									<li key={`red-${index}`} className="mb-5">{nickname}</li>
								))}
							</ul>
							
						</div>
							<ul>
								{redStatus.map((status, index) => (
										<li key={`red-${index}`} className="mb-5">{status}</li>
									))}
							</ul>
						</div>
					</div>
				</div>
				
        
    </div>
  );
}
