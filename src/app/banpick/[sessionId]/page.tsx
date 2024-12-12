"use client";

import { use, useState, useEffect } from "react";
import champions from "../../../../public/champions.json";
import { phaseOrder } from "@/data/phase";
import { Champion, PhaseTurn, PhaseType, Player } from "@/types/types";
import BanSlot from "@/components/slots/BanSlot";
import RedPickSlot from "@/components/slots/RedPickSlot";
import BluePickSlot from "@/components/slots/BluePickSlot";
import Image from "next/image";
import ChampionList from "@/components/ChampionList";
import { ref, onValue, update } from "firebase/database";
import database from "@/firebase/firebase";

export default function BanpickUI({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params); 
  const [redTeamName, setRedTeamName] = useState("레드 팀");
  const [blueTeamName, setBlueTeamName] = useState("블루 팀");
  const [redTeamMemberNames, setRedTeamMemberNames] = useState<string[]>(Array(5).fill("대기 중"));
  const [blueTeamMemberNames, setBlueTeamMemberNames] = useState<string[]>(Array(5).fill("대기 중"));
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
    id: -1,
    name: "선택하지 않음",
    image: "",
    pickimg: "",
  };

  // Firebase 데이터 가져오기 (팀 이름 및 진행 상태)
  const isTestMode = true;

  useEffect(() => {
    if (isTestMode) {
      // 테스트 환경 데이터 설정
      setBlueTeamName("테스트 블루 팀");
      setRedTeamName("테스트 레드 팀");
      setBlueTeamMemberNames(["플레이어1", "플레이어2", "플레이어3", "플레이어4", "플레이어5"]);
      setRedTeamMemberNames(["플레이어6", "플레이어7", "플레이어8", "플레이어9", "플레이어10"]);
      setCurrentPhase("ban1");
      setCurrentTurn(0);
    } else {
      const sessionRef = ref(database, `sessions/${sessionId}`);
    
      const unsubscribe = onValue(sessionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // 팀 이름 가져오기
          const blueTeamName = data.teams.blue?.name || "블루 팀";
          const redTeamName = data.teams.red?.name || "레드 팀";
          setBlueTeamName(blueTeamName);
          setRedTeamName(redTeamName);
    
          // 팀원 닉네임 가져오기
          const blueTeamPlayers = Object.values(data.teams.blue?.players || {}) as Player[];
          const redTeamPlayers = Object.values(data.teams.red?.players || {}) as Player[];
    
          const blueTeamMemberNames = blueTeamPlayers.map((player) => player.nickname || "대기 중");
          const redTeamMemberNames = redTeamPlayers.map((player) => player.nickname || "대기 중");
    
          setBlueTeamMemberNames([...blueTeamMemberNames]);
          setRedTeamMemberNames([...redTeamMemberNames]);
    
          // 밴픽 상태 가져오기
          if (data.banpick) {
            setCurrentPhase(data.banpick.currentPhase || "ban1");
            setCurrentTurn(data.banpick.currentTurn || 0);
          }
        }
      });
    
      return () => unsubscribe();
    }
  }, [sessionId]);
  

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
      setSelectedChampion(NO_SELECTION);
      handleConfirmSelection();
    } else if (currentPhase.startsWith("pick")) {
      const availableChampions = champions.filter(
        (champion) =>
          !bannedChampions.some((banned) => banned.id === champion.id) &&
          !pickedChampions.some((picked) => picked.id === champion.id)
      );
      const randomChampion = availableChampions[Math.floor(Math.random() * availableChampions.length)];
      setSelectedChampion(randomChampion);
      setTimeout(() => {
        handleConfirmSelection();
      }, 0);
    }
  };

  // 선택 완료 핸들러
  const handleConfirmSelection = () => {
    if (!selectedChampion && currentPhase.startsWith("pick")) return;

    const phaseTurns: PhaseTurn[] = phaseOrder[currentPhase];
    const currentTurnInfo: PhaseTurn = phaseTurns[currentTurn];

    setRippleSlot(currentTurnInfo);
    setTimeout(() => setRippleSlot(null), 800);

    if (currentPhase.startsWith("ban")) {
      setBannedChampions((prev) => [...prev, selectedChampion || NO_SELECTION]);
      setBanSlots((prev) => {
        const updated = { ...prev };
        updated[currentTurnInfo.team][currentTurnInfo.turn % 5] =
          selectedChampion || NO_SELECTION;
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

    // Firebase에 업데이트
    update(ref(database, `sessions/${sessionId}/banpick`), {
      [`${currentPhase}/${currentTurn}`]: {
        team: currentTurnInfo.team,
        champion: selectedChampion || NO_SELECTION,
      },
      currentPhase,
      currentTurn: currentTurn + 1,
    });

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

    setTimer(30);
    setSelectedChampion(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black">
      <div className="flex items-center justify-between bg-gray-200 h-40">
        <div className="flex items-start justify-center bg-blue-500 text-black font-bold text-3xl w-[45%] h-full font-gong">
          {blueTeamName}
        </div>
        <div className="flex items-center justify-center bg-gray-800 text-white font-bold text-3xl w-[10%] h-full font-gong">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold font-gong">{currentPhase.toUpperCase()}</h2>
            {timer}
          </div>
        </div>
        <div className="flex items-start justify-center bg-red-500 text-black font-bold text-3xl w-[45%] h-full font-gong">
          {redTeamName}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="w-1/4">
            {blueTeamMemberNames.map((name, idx) => (
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
            <div className="flex space-x-2 justify-center mt-2 w-[100%]">
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
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-center">
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

          <div className="w-1/4">
            {redTeamMemberNames.map((name, idx) => (
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
            <div className="flex space-x-2 justify-center mt-4">
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
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center items-center px-10 py-4">
          <ChampionList
            champions={champions}
            bannedChampions={bannedChampions}
            pickedChampions={pickedChampions}
            onChampionClick={setSelectedChampion}
            onConfirmSelection={handleConfirmSelection}
          />
        </div>
      </div>
    </div>
  );
}
