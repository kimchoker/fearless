"use client";

import { use, useState, useEffect } from "react";
import champions from "../../../../../public/champions.json";
import { phaseOrder } from "@/data/phase";
import { Champion, PhaseTurn, PhaseType, Player } from "@/types/types";
import BanSlot from "@/components/slots/BanSlot";
import RedPickSlot from "@/components/slots/RedPickSlot";
import BluePickSlot from "@/components/slots/BluePickSlot";
import Image from "next/image";
import ChampionList from "@/components/ChampionList";
import { ref, onValue, update } from "firebase/database";
import database from "@/firebase/firebase";

export default function BanpickUI({ params }: { params: Promise<{ sessionId: string; playerKey: string }> }) {
  const { sessionId, playerKey } = use(params); 
  const [redTeamName, setRedTeamName] = useState("RED");
  const [blueTeamName, setBlueTeamName] = useState("BLUE");
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
  const [currentSelectedChampion, setCurrentSelectedChampion] = useState<Champion | null>(null);

  useEffect(() => {
    const selectedRef = ref(database, `sessions/${sessionId}/banpick/${currentPhase}/currentSelected`);
    const unsubscribe = onValue(selectedRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentSelectedChampion(data || null);
    });
  
    return () => unsubscribe();
  }, [sessionId, currentPhase]);

  const [timer, setTimer] = useState(30);

  const NO_SELECTION: Champion = {
    id: -1,
    name: "선택하지 않음",
    image: "",
    pickimg: "",
  };

  const currentTurnKey = phaseOrder[currentPhase][currentTurn]?.key;

  // Firebase 데이터 가져오기 (팀 이름 및 진행 상태)
  const isTestMode = playerKey ==="test";

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
          const blueTeamName = data.teams.blue?.name || "BLUE";
          const redTeamName = data.teams.red?.name || "RED";
          setBlueTeamName(blueTeamName);
          setRedTeamName(redTeamName);
    
          // 팀원 닉네임 가져오기
          const blueTeamPlayers = Object.values(data.teams.blue?.players || {}) as Player[];
          const redTeamPlayers = Object.values(data.teams.red?.players || {}) as Player[];
    
          const blueTeamMemberNames = blueTeamPlayers.map((player, index) => player.nickname || `player${index + 1}`);
          const redTeamMemberNames = redTeamPlayers.map((player, index) => player.nickname || `player${index + 1}`);
    
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
    handleConfirmSelection();
  };
  

  // 선택 완료 핸들러
  const handleConfirmSelection = () => {
    let championToConfirm = selectedChampion;
  
    // 선택된 챔피언이 없을 경우, 랜덤으로 강제 선택
    if (!championToConfirm && currentPhase.startsWith("pick")) {
      const availableChampions = champions.filter(
        (champion) =>
          !bannedChampions.some((banned) => banned.id === champion.id) &&
          !pickedChampions.some((picked) => picked.id === champion.id)
      );
      championToConfirm =
        availableChampions[
          Math.floor(Math.random() * availableChampions.length)
        ] || NO_SELECTION;
  
      setSelectedChampion(championToConfirm); // 상태에 반영
    }
  
    const phaseTurns: PhaseTurn[] = phaseOrder[currentPhase];
    const currentTurnInfo: PhaseTurn = phaseTurns[currentTurn];
  
    // 밴 또는 픽 처리
    if (currentPhase.startsWith("ban")) {
      setBannedChampions((prev) => [...prev, championToConfirm || NO_SELECTION]);
      setBanSlots((prev) => {
        const updated = { ...prev };
        updated[currentTurnInfo.team][currentTurnInfo.turn % 5] =
          championToConfirm || NO_SELECTION;
        return updated;
      });
    } else if (currentPhase.startsWith("pick")) {
      setPickedChampions((prev) => [...prev, championToConfirm!]);
      setPickSlots((prev) => {
        const updated = { ...prev };
        updated[currentTurnInfo.team][currentTurnInfo.turn % 5] = championToConfirm!;
        return updated;
      });
    }
  
    // Firebase에 업데이트
    update(ref(database, `sessions/${sessionId}/banpick`), {
      [`${currentPhase}/${currentTurn}`]: {
        team: currentTurnInfo.team,
        champion: championToConfirm || NO_SELECTION,
      },
      currentPhase,
      currentTurn: currentTurn + 1,
    });
  
    // 다음 턴으로 이동
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
    <div className="min-h-screen bg-gray-200 text-black aspect-[16/9]">
      <div className="flex items-center justify-between bg-gray-200 h-40 ">
        <div className="flex items-center justify-center bg-blue-700 text-gray-200 font-bold text-5xl w-[45%] h-full font-gong">
          {blueTeamName}
        </div>
        <div className="flex items-center justify-center bg-gray-800 text-white font-bold text-5xl w-[10%] h-full font-gong">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-gong mb-4">
              {currentPhase === "ban1" && "BAN PHASE 1"}
              {currentPhase === "pick1" && "PICK PHASE 1"}
              {currentPhase === "ban2" && "BAN PHASE 2"}
              {currentPhase === "pick2" && "PICK PHASE 2"}
            </h2>
            {currentPhase !== "complete" && `:${timer}`}
          </div>
        </div>
        <div className="flex items-center justify-center bg-red-700 text-gray-200 font-bold text-5xl w-[45%] h-full font-gong">
          {redTeamName}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full">
          {/* 블루 팀 */}
          <div className="w-1/4">
            {/* 픽 슬롯 */}
            <BluePickSlot
              key="7"
              playerName={blueTeamMemberNames[0]}
              slotData={pickSlots.blue[0]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "7"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "7"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <BluePickSlot
              key="10"
              playerName={blueTeamMemberNames[1]}
              slotData={pickSlots.blue[1]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "10"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "10"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <BluePickSlot
              key="11"
              playerName={blueTeamMemberNames[2]}
              slotData={pickSlots.blue[2]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "11"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "11"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <BluePickSlot
              key="18"
              playerName={blueTeamMemberNames[3]}
              slotData={pickSlots.blue[3]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "18"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "18"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <BluePickSlot
              key="19"
              playerName={blueTeamMemberNames[4]}
              slotData={pickSlots.blue[4]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "19"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "19"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />

            {/* 밴 슬롯 */}
            <div className="flex justify-center w-[100%] mt-5">
              <BanSlot
                key="1"
                slotData={banSlots.blue[0]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "1"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "1"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
                
              />
              <BanSlot
                key="3"
                slotData={banSlots.blue[1]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "3"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "3"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="5"
                slotData={banSlots.blue[2]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "5"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "5"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="14"
                slotData={banSlots.blue[3]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "14"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "14"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="16"
                slotData={banSlots.blue[4]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "16"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "16"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
            </div>
          </div>

          
          {/* 중앙 이미지 및 챔피언 리스트 조건부 렌더링*/}
          <div className="w-1/2 flex flex-col items-center">
            {playerKey === "99" ? (
              // 관전자인 경우 중앙 광고 이미지 렌더링
              <div className="flex justify-center items-center bg-gray-500 h-[90%] relative w-full">
                <Image
                  src="/main.jpg"
                  alt="중앙 광고 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            ) : (
              // 플레이어인 경우 ChampionList 렌더링
              <div className="flex w-full justify-center items-center">
                <ChampionList
                  champions={champions}
                  bannedChampions={bannedChampions}
                  pickedChampions={pickedChampions}
                  onChampionClick={setSelectedChampion}
                  onConfirmSelection={handleConfirmSelection}
                  isDisabled={playerKey !== currentTurnKey}
                  sessionId={sessionId}
                  currentPhase={currentPhase}
                />
              </div>
            )}
          </div>


          {/* 레드 팀 */}
          <div className="w-1/4">
            {/* 픽 슬롯 */}
            <RedPickSlot
              key="8"
              playerName={redTeamMemberNames[0]}
              slotData={pickSlots.red[0]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "8"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "8"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <RedPickSlot
              key="9"
              playerName={redTeamMemberNames[1]}
              slotData={pickSlots.red[1]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "9"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "9"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <RedPickSlot
              key="12"
              playerName={redTeamMemberNames[2]}
              slotData={pickSlots.red[2]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "12"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "12"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <RedPickSlot
              key="17"
              playerName={redTeamMemberNames[3]}
              slotData={pickSlots.red[3]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "17"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "17"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />
            <RedPickSlot
              key="20"
              playerName={redTeamMemberNames[4]}
              slotData={pickSlots.red[4]}
              isCurrentTurn={
                phaseOrder[currentPhase][currentTurn]?.key === "20"
              }
              isRipple={
                phaseOrder[currentPhase][currentTurn]?.ripple === "20"
              }
              selectedChampion={selectedChampion}
              currentSelected={currentSelectedChampion}
            />

            {/* 밴 슬롯 */}
            <div className="flex justify-center mt-5">
              <BanSlot
                key="2"
                slotData={banSlots.red[0]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "2"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "2"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="4"
                slotData={banSlots.red[1]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "4"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "4"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="6"
                slotData={banSlots.red[2]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "6"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "6"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="13"
                slotData={banSlots.red[3]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "13"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "13"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
              <BanSlot
                key="15"
                slotData={banSlots.red[4]}
                isCurrentTurn={
                  phaseOrder[currentPhase][currentTurn]?.key === "15"
                }
                isRipple={
                  phaseOrder[currentPhase][currentTurn]?.ripple === "15"
                }
                selectedChampion={selectedChampion}
                currentSelected={currentSelectedChampion}
              />
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
