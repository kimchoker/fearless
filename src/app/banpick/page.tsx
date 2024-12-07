"use client";

import { useState, useEffect } from "react";
import champions from "../../../public/champions.json";
import { phaseOrder } from "@/data/phase";
import { Champion, PhaseTurn, PhaseType } from "@/types/types";
import BanSlot from "@/components/slots/BanSlot";
import RedPickSlot from "@/components/slots/RedPickSlot";
import BluePickSlot from "@/components/slots/BluePickSlot";
import Image from "next/image";

export default function BanpickUI() {
  const [redTeamNames, setRedTeamNames] = useState(["Doran", "Oner", "Faker", "Gumayusi", "Keria"]);
  const [blueTeamNames, setBlueTeamNames] = useState(["Marin", "Bengi", "Faker", "Bang", "Wolf"]);
  const [searchText, setSearchText] = useState("");
  const [currentPhase, setCurrentPhase] = useState<PhaseType>("ban1");
  const [currentTurn, setCurrentTurn] = useState(0);
  const [banSlots, setBanSlots] = useState<Record<"blue" | "red", (Champion | null)[]>>({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });
  const [pickSlots, setPickSlots] = useState<Record<"blue" | "red", (Champion | null)[]>>({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });
  const [bannedChampions, setBannedChampions] = useState<Champion[]>([]);
  const [pickedChampions, setPickedChampions] = useState<Champion[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [rippleSlot, setRippleSlot] = useState<{ team: "blue" | "red"; turn: number } | null>(null);
  const [timer, setTimer] = useState(30);

  const NO_SELECTION: Champion = {
    id: -1, // 실제 데이터와 겹치지 않는 특별한 ID 값
    name: "선택하지 않음",
    image: "", // 이미지가 필요 없으면 빈 문자열
    pickimg: "", // pickimg도 빈 문자열로 설정
  };
  
  // 타이머 로직
  useEffect(() => {
    const phaseTurns = phaseOrder[currentPhase];
    if (currentPhase === "complete" || !phaseTurns[currentTurn]) return;

    const timeout = setTimeout(() => {
      if (timer === 0) {
        handleTimeOut();
      } else {
        setTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer, currentPhase, currentTurn]);

  // 타임아웃 처리 로직
  const handleTimeOut = () => {
    const phaseTurns = phaseOrder[currentPhase];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentTurnInfo = phaseTurns[currentTurn];
  
    if (currentPhase.startsWith("ban")) {
      setSelectedChampion(NO_SELECTION); // 선택하지 않음 값 설정
      handleConfirmSelection();
    } else if (currentPhase.startsWith("pick")) {
      const availableChampions = champions.filter(
        (champion) =>
          !bannedChampions.some((banned) => banned.id === champion.id) &&
          !pickedChampions.some((picked) => picked.id === champion.id)
      );
      const randomChampion = availableChampions[Math.floor(Math.random() * availableChampions.length)];
      setSelectedChampion(randomChampion); // 랜덤 선택
      setTimeout(() => {
        handleConfirmSelection(); // 강제로 선택 완료 버튼 누름
      }, 0);
    }
  };
  
  

  const handleChampionClick = (champion: Champion) => {
    if (
      bannedChampions.some((banned) => banned?.id === champion.id) ||
      pickedChampions.some((picked) => picked?.id === champion.id)
    )
      return;
    setSelectedChampion(champion);
  };
  
  const handleConfirmSelection = () => {
    if (!selectedChampion && currentPhase.startsWith("pick")) return;

    const phaseTurns: PhaseTurn[] = phaseOrder[currentPhase];
    const currentTurnInfo: PhaseTurn = phaseTurns[currentTurn];

    setRippleSlot(currentTurnInfo);
    setTimeout(() => setRippleSlot(null), 800);

    if (currentPhase.startsWith("ban")) {
      setBannedChampions((prev) => [...prev, selectedChampion || NO_SELECTION]); // 선택하지 않음을 추가
      setBanSlots((prev) => {
        const updated = { ...prev };
        updated[currentTurnInfo.team][currentTurnInfo.turn % 5] =
          selectedChampion || NO_SELECTION; // 빈 칸 처리
        return updated;
      });
    } else if (currentPhase.startsWith("pick")) {
      setPickedChampions((prev) => [...prev, selectedChampion!]);
      setPickSlots((prev) => {
        const updated = { ...prev };
        updated[currentTurnInfo.team][currentTurnInfo.turn % 5] = selectedChampion!;
        return updated;
      });
    }
    
    const nextTurn = currentTurn + 1;
    if (nextTurn >= phaseTurns.length) {
      if (currentPhase === "ban1") setCurrentPhase("pick1");
      else if (currentPhase === "pick1") setCurrentPhase("ban2");
      else if (currentPhase === "ban2") setCurrentPhase("pick2");
      else if (currentPhase === "pick2") setCurrentPhase("complete");
      setCurrentTurn(0);
    } else {
      setCurrentTurn(nextTurn);
    }

    setTimer(30); // 타이머 초기화
    setSelectedChampion(null);
  };

  const filteredChampions = champions.filter(
    (champion) =>
      champion.name.includes(searchText) &&
      !bannedChampions.some((banned) => banned?.id === champion.id) &&
      !pickedChampions.some((picked) => picked?.id === champion.id)
  );
  

  const handleBlueTeamNameChange = (index: number, value: string) => {
    setBlueTeamNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRedTeamNameChange = (index: number, value: string) => {
    setRedTeamNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black">
      <div className="flex items-center justify-between bg-gray-200 h-16">
        <div className="flex items-center justify-center bg-blue-500 text-black font-bold text-xl w-[40%] h-full font-gong">
          Blue Team
        </div>
        <div className="flex items-center justify-center bg-gray-800 text-white font-bold text-3xl w-[20%] h-full font-gong">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold font-gong">{currentPhase.toUpperCase()} PHASE</h2>
            {timer}
          </div>
        
        </div>
        <div className="flex items-center justify-center bg-red-500 text-black font-bold text-xl w-[40%] h-full font-gong">
          Red Team
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="w-1/4">
            <>
              {blueTeamNames.map((name, idx) => (
                <BluePickSlot
                  key={idx}
                  playerName={name}
                  slotData={pickSlots.blue[idx]}
                  isCurrentTurn={
                    currentPhase.startsWith("pick") &&
                    phaseOrder[currentPhase][currentTurn]?.team === "blue" &&
                    phaseOrder[currentPhase][currentTurn]?.turn === idx
                  }
                  selectedChampion={selectedChampion}
                  isRipple={
                    rippleSlot?.team === "blue" &&
                    rippleSlot?.turn === idx &&
                    currentPhase.startsWith("pick")
                  }
                />
              ))}
            </>

            <div className="flex space-x-2 justify-center mt-2 w-[100%]">
              <>
                {banSlots.blue.map((slot, idx) => (
                  <BanSlot
                    key={idx}
                    slotData={slot}
                    isCurrentTurn={
                      currentPhase.startsWith("ban") &&
                      phaseOrder[currentPhase][currentTurn]?.team === "blue" &&
                      phaseOrder[currentPhase][currentTurn]?.turn === idx
                    }
                    isRipple={
                      rippleSlot?.team === "blue" &&
                      rippleSlot?.turn === idx &&
                      currentPhase.startsWith("ban")
                    }
                    selectedChampion={selectedChampion}
                  />
                ))}
              </>
            </div>
          </div>

          

          <div className="w-1/2 flex flex-col items-center">
            <div className="flex justify-center items-center bg-gray-500 h-96 relative w-full">
              <Image
                src="/main.jpg" 
                alt="중앙 광고 이미지"
                layout="fill" 
                objectFit="cover" 
                className="rounded" 
              />
            </div>
          </div>


          <div className="w-1/4">
            <>
              {redTeamNames.map((name, idx) => (
                <RedPickSlot
                  key={idx}
                  playerName={name}
                  slotData={pickSlots.red[idx]}
                  isCurrentTurn={
                    currentPhase.startsWith("pick") &&
                    phaseOrder[currentPhase][currentTurn]?.team === "red" &&
                    phaseOrder[currentPhase][currentTurn]?.turn === idx
                  }
                  selectedChampion={selectedChampion}
                  isRipple={
                    rippleSlot?.team === "red" &&
                    rippleSlot?.turn === idx &&
                    currentPhase.startsWith("pick")
                  }
                />
              ))}
            </>

            <div className="flex space-x-2 justify-center mt-4">
              <>
                {banSlots.red.map((slot, idx) => (
                  <BanSlot
                    key={idx}
                    slotData={slot}
                    isCurrentTurn={
                      currentPhase.startsWith("ban") &&
                      phaseOrder[currentPhase][currentTurn]?.team === "red" &&
                      phaseOrder[currentPhase][currentTurn]?.turn === idx
                    }
                    isRipple={
                      rippleSlot?.team === "red" &&
                      rippleSlot?.turn === idx &&
                      currentPhase.startsWith("ban")
                    }
                    selectedChampion={selectedChampion}
                  />
                ))}
              </>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between px-10 py-4">
          <div className="flex flex-col space-y-2 font-gong">
            {blueTeamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleBlueTeamNameChange(index, e.target.value)}
                className="bg-gray-300 w-48 text-center py-2"
              />
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleConfirmSelection}
              className="bg-gray-700 text-white py-4 px-10 rounded font-gong text-xl"
            >
              선택 완료
            </button>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="챔피언 검색"
              className="bg-gray-300 text-center py-2 px-6 rounded"
            />
            <div className="grid grid-cols-6 gap-4 bg-gray-500 text-center py-4 px-6 rounded max-h-64 overflow-y-auto">
              {filteredChampions.map((champion) => (
                <div
                  key={champion.id}
                  className={`flex flex-col items-center justify-center cursor-pointer ${
                    bannedChampions.some((banned) => banned.id === champion.id) ||
                    pickedChampions.some((picked) => picked.id === champion.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      !bannedChampions.some((banned) => banned?.id === champion.id) &&
                      !pickedChampions.some((picked) => picked?.id === champion.id)
                    ) {
                      handleChampionClick(champion);
                    }
                  }}
                  
                >
                  <img
                    src={champion.image.replace("./", "/")}
                    alt={champion.name}
                    className="w-12 h-12 rounded"
                  />
                  <p className="text-xs text-white">{champion.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2 font-gong">
            {redTeamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleRedTeamNameChange(index, e.target.value)}
                className="bg-gray-300 w-48 text-center py-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
