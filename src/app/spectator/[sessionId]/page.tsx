/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, use } from "react";
import { ref, onValue } from "firebase/database";
import database from "@/firebase/firebase";
import BluePickSlot from "@/components/slots/BluePickSlot";
import RedPickSlot from "@/components/slots/RedPickSlot";
import BanSlot from "@/components/slots/BanSlot";
import Image from "next/image";
import { Champion } from "@/types/types";

export default function SpectatorWaitingScreen({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);

  const [blueTeamName, setBlueTeamName] = useState("블루 팀");
  const [redTeamName, setRedTeamName] = useState("레드 팀");
  const [isStarted, setIsStarted] = useState(false);
  const [dots, setDots] = useState(".");
  const [currentPhase, setCurrentPhase] = useState("waiting");
  const [currentTurn, setCurrentTurn] = useState(0);
  const [blueTeamMemberNames, setBlueTeamMemberNames] = useState<string[]>(Array(5).fill("대기 중"));
  const [redTeamMemberNames, setRedTeamMemberNames] = useState<string[]>(Array(5).fill("대기 중"));
  const [banSlots, setBanSlots] = useState<Record<"blue" | "red", (Champion | null)[]>>({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });
  const [pickSlots, setPickSlots] = useState<Record<"blue" | "red", (Champion | null)[]>>({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });

  useEffect(() => {
    const sessionRef = ref(database, `sessions/${sessionId}`);

    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBlueTeamName(data.teams?.blue?.name || "블루 팀");
        setRedTeamName(data.teams?.red?.name || "레드 팀");
        setIsStarted(data.status?.isStarted || false);
        setCurrentPhase(data.banpick?.currentPhase || "waiting");
        setCurrentTurn(data.banpick?.currentTurn || 0);
        setBlueTeamMemberNames((data.teams?.blue?.players || []).map((player: any) => player.nickname || "대기 중"));
        setRedTeamMemberNames((data.teams?.red?.players || []).map((player: any) => player.nickname || "대기 중"));
        setBanSlots(data.banpick?.banSlots || {
          blue: Array(5).fill(null),
          red: Array(5).fill(null),
        });
        setPickSlots(data.banpick?.pickSlots || {
          blue: Array(5).fill(null),
          red: Array(5).fill(null),
        });
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length === 3 ? "." : prevDots + "."));
    }, 500); // 500ms마다 점 개수 변경

    return () => clearInterval(interval);
  }, []);

  if (isStarted) {
    return (
      <div className="min-h-screen bg-gray-200 text-black">
        <div className="flex items-center justify-between bg-gray-200 h-40">
          <div className="flex items-start justify-center bg-blue-700 text-black font-bold text-3xl w-[45%] h-full font-gong">
            {blueTeamName}
          </div>
          <div className="flex items-center justify-center bg-gray-800 text-white font-bold text-3xl w-[10%] h-full font-gong">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold font-gong">{currentPhase.toUpperCase()}</h2>
              {currentPhase !== "complete" && currentTurn}
            </div>
          </div>
          <div className="flex items-start justify-center bg-red-700 text-black font-bold text-3xl w-[45%] h-full font-gong">
            {redTeamName}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full">
            {/* 블루 팀 */}
            <div className="w-1/5">
              <BluePickSlot
                key="7"
                playerName={blueTeamMemberNames[0]}
                slotData={pickSlots.blue[0]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 0}
                isRipple={currentPhase === "pick1" && currentTurn === 0}
                selectedChampion={null}
              />
              <BluePickSlot
                key="10"
                playerName={blueTeamMemberNames[1]}
                slotData={pickSlots.blue[1]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 3}
                isRipple={currentPhase === "pick1" && currentTurn === 3}
                selectedChampion={null}
              />
              <BluePickSlot
                key="11"
                playerName={blueTeamMemberNames[2]}
                slotData={pickSlots.blue[2]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 4}
                isRipple={currentPhase === "pick1" && currentTurn === 4}
                selectedChampion={null}
              />
              <BluePickSlot
                key="18"
                playerName={blueTeamMemberNames[3]}
                slotData={pickSlots.blue[3]}
                isCurrentTurn={currentPhase === "pick2" && currentTurn === 1}
                isRipple={currentPhase === "pick2" && currentTurn === 1}
                selectedChampion={null}
              />
              <BluePickSlot
                key="19"
                playerName={blueTeamMemberNames[4]}
                slotData={pickSlots.blue[4]}
                isCurrentTurn={currentPhase === "pick2" && currentTurn === 2}
                isRipple={currentPhase === "pick2" && currentTurn === 2}
                selectedChampion={null}
              />

              {/* 블루 팀 밴 슬롯 */}
              <BanSlot
                key="1"
                slotData={banSlots.blue[0]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 0}
                isRipple={currentPhase === "ban1" && currentTurn === 0}
                selectedChampion={null}
              />
              <BanSlot
                key="3"
                slotData={banSlots.blue[1]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 2}
                isRipple={currentPhase === "ban1" && currentTurn === 2}
                selectedChampion={null}
              />
              <BanSlot
                key="5"
                slotData={banSlots.blue[2]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 4}
                isRipple={currentPhase === "ban1" && currentTurn === 4}
                selectedChampion={null}
              />
            </div>

            {/* 중앙 이미지 */}
            <div className="w-3/5 flex flex-col items-center">
              <div className="flex justify-center items-center bg-gray-500 h-[90%] relative w-full">
                <Image
                  src="/main.jpg"
                  alt="중앙 광고 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            </div>

            {/* 레드 팀 */}
            <div className="w-1/5">
              <RedPickSlot
                key="8"
                playerName={redTeamMemberNames[0]}
                slotData={pickSlots.red[0]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 1}
                isRipple={currentPhase === "pick1" && currentTurn === 1}
                selectedChampion={null}
              />
              <RedPickSlot
                key="9"
                playerName={redTeamMemberNames[1]}
                slotData={pickSlots.red[1]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 2}
                isRipple={currentPhase === "pick1" && currentTurn === 2}
                selectedChampion={null}
              />
              <RedPickSlot
                key="12"
                playerName={redTeamMemberNames[2]}
                slotData={pickSlots.red[2]}
                isCurrentTurn={currentPhase === "pick1" && currentTurn === 5}
                isRipple={currentPhase === "pick1" && currentTurn === 5}
                selectedChampion={null}
              />
              <RedPickSlot
                key="17"
                playerName={redTeamMemberNames[3]}
                slotData={pickSlots.red[3]}
                isCurrentTurn={currentPhase === "pick2" && currentTurn === 0}
                isRipple={currentPhase === "pick2" && currentTurn === 0}
                selectedChampion={null}
              />
              <RedPickSlot
                key="20"
                playerName={redTeamMemberNames[4]}
                slotData={pickSlots.red[4]}
                isCurrentTurn={currentPhase === "pick2" && currentTurn === 3}
                isRipple={currentPhase === "pick2" && currentTurn === 3}
                selectedChampion={null}
              />

              {/* 레드 팀 밴 슬롯 */}
              <BanSlot
                key="2"
                slotData={banSlots.red[0]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 1}
                isRipple={currentPhase === "ban1" && currentTurn === 1}
                selectedChampion={null}
              />
              <BanSlot
                key="4"
                slotData={banSlots.red[1]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 3}
                isRipple={currentPhase === "ban1" && currentTurn === 3}
                selectedChampion={null}
              />
              <BanSlot
                key="6"
                slotData={banSlots.red[2]}
                isCurrentTurn={currentPhase === "ban1" && currentTurn === 5}
                isRipple={currentPhase === "ban1" && currentTurn === 5}
                selectedChampion={null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 flex flex-col justify-center items-center min-h-screen text-white font-gong">
      <h1 className="text-4xl font-bold mb-8">밴픽 대기 중{dots}</h1>

      <div className="flex w-full justify-around max-w-4xl">
        {/* 블루 팀 이름 */}
        <div className="flex flex-col items-center bg-blue-700 text-white rounded-lg p-8 w-1/3">
          <h2 className="text-3xl font-bold">{blueTeamName}</h2>
        </div>

        {/* 레드 팀 이름 */}
        <div className="flex flex-col items-center bg-red-700 text-white rounded-lg p-8 w-1/3">
          <h2 className="text-3xl font-bold">{redTeamName}</h2>
        </div>
      </div>

      <p className="text-lg mt-8">게임 시작을 기다리고 있습니다...</p>
    </div>
  );
}
