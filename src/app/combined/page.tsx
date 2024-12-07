"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import champions from "../../../public/champions.json";
import { useBanpickStore } from "@/store/banpickStore";
import { Champion } from "@/types/types";

export default function CombinedPage() {
  const {
    games,
    addGame,
    deleteGame,
    addChampionToTeam,
    removeChampionFromTeam,
  } = useBanpickStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);

  // 초기 챔피언 리스트 설정
  useEffect(() => {
    const sortedChampions = [...champions].sort((a, b) =>
      a.name.localeCompare(b.name, "ko-KR")
    );
    setAvailableChampions(sortedChampions);
  }, []);

  const filteredChampions = availableChampions.filter((champion) =>
    champion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, champion: Champion) => {
    e.dataTransfer.setData("champion", JSON.stringify(champion)); // 드래그 데이터를 JSON 문자열로 저장
  };

  const handleDrop = (team: "red" | "blue", gameId: string, championData: string) => {
    try {
      const champion = JSON.parse(championData); // JSON 문자열 파싱
      addChampionToTeam(gameId, team, champion); // 상태 업데이트
      setAvailableChampions((prev) => prev.filter((c) => c.id !== champion.id)); // 목록에서 제거
    } catch (error) {
      console.error("드롭 데이터 처리 중 오류 발생:", error);
    }
  };

  const handleRemoveFromTeam = (team: "red" | "blue", gameId: string, champion: Champion) => {
    removeChampionFromTeam(gameId, team, champion); // 팀에서 제거
    setAvailableChampions((prev) =>
      [...prev, champion].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
    );
  };

  const handleDeleteGame = (gameId: string) => {
    const gameData = games[gameId];
    if (gameData) {
      const championsToRestore = [...gameData.red, ...gameData.blue];
      setAvailableChampions((prev) =>
        [...prev, ...championsToRestore].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
      );
    }
    deleteGame(gameId); // 게임 삭제
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-500 text-white">
      {/* 상단 메인 UI */}
      <div className="bg-[#D6E4F0] text-black p-4">
        <div className="flex w-full max-w-7xl mx-auto justify-between">
          {/* 레드 팀 */}
          <div className="flex flex-col items-end w-1/3 space-y-2">
            {Object.entries(games).map(([gameId, gameData]) => (
              <div key={gameId} className="text-right">
                <h2 className="font-bold">{gameId.toUpperCase()}</h2>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, index) => {
                    const champion = gameData.red[index];
                    return champion ? (
                      <Image
                        key={champion.id}
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    ) : (
                      <div
                        key={`red-slot-${gameId}-${index}`}
                        className="w-10 h-10 bg-gray-300 border rounded"
                        onDragOver={(e) => e.preventDefault()} // 드롭 허용
                        onDrop={(e) => {
                          const championData = e.dataTransfer.getData("champion");
                          handleDrop("red", gameId, championData);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 중앙 로고 */}
          <div className="flex flex-col items-center w-1/3">
            <Image src="/logo.png" alt="Logo" width={128} height={128} className="rounded" />
          </div>

          {/* 블루 팀 */}
          <div className="flex flex-col items-start w-1/3 space-y-2">
            {Object.entries(games).map(([gameId, gameData]) => (
              <div key={gameId} className="text-left">
                <h2 className="font-bold">{gameId.toUpperCase()}</h2>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, index) => {
                    const champion = gameData.blue[index];
                    return champion ? (
                      <Image
                        key={champion.id}
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    ) : (
                      <div
                        key={`blue-slot-${gameId}-${index}`}
                        className="w-10 h-10 bg-gray-300 border rounded"
                        onDragOver={(e) => e.preventDefault()} // 드롭 허용
                        onDrop={(e) => {
                          const championData = e.dataTransfer.getData("champion");
                          handleDrop("blue", gameId, championData);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 설정 페이지 UI */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">송출 설정</h1>
          <button onClick={addGame} className="ml-4 p-2 bg-blue-600 rounded hover:bg-blue-700">
            게임 추가
          </button>
        </div>

        {/* 게임별 팀 설정 */}
        {Object.keys(games).map((gameId) => (
          <div key={gameId} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{gameId}</h2>
              <button
                onClick={() => handleDeleteGame(gameId)} // 게임 삭제 처리
                className="p-2 bg-red-600 rounded hover:bg-red-700"
              >
                게임 삭제
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Red Team */}
              <div className="bg-red-500 p-4 rounded">
                <h3 className="text-lg font-bold mb-2">Red Team</h3>
                <div
                  className="grid grid-cols-5 gap-2 min-h-[80px] bg-red-400 p-2 rounded"
                  onDragOver={(e) => e.preventDefault()} // 드롭 허용
                  onDrop={(e) => {
                    const championData = e.dataTransfer.getData("champion");
                    handleDrop("red", gameId, championData);
                  }}
                >
                  {games[gameId]?.red?.map((champion) => (
                    <div
                      key={champion.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, champion)} // 드래그 시작
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleRemoveFromTeam("red", gameId, champion);
                      }}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <p className="text-xs text-center">{champion.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blue Team */}
              <div className="bg-blue-500 p-4 rounded">
                <h3 className="text-lg font-bold mb-2">Blue Team</h3>
                <div
                  className="grid grid-cols-5 gap-2 min-h-[80px] bg-blue-400 p-2 rounded"
                  onDragOver={(e) => e.preventDefault()} // 드롭 허용
                  onDrop={(e) => {
                    const championData = e.dataTransfer.getData("champion");
                    handleDrop("blue", gameId, championData);
                  }}
                >
                  {games[gameId]?.blue?.map((champion) => (
                    <div
                      key={champion.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, champion)} // 드래그 시작
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleRemoveFromTeam("blue", gameId, champion);
                      }}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <p className="text-xs text-center">{champion.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 챔피언 리스트 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">챔피언 리스트</h2>
            <input
              type="text"
              placeholder="챔피언 이름을 검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-64 rounded bg-gray-700 border text-white"
            />
          </div>
          <div className="grid grid-cols-12 gap-1">
            {filteredChampions.map((champion) => (
              <div
                key={champion.id}
                className="flex flex-col items-center"
                draggable
                onDragStart={(e) => handleDragStart(e, champion)} // 드래그 시작
              >
                <Image
                  src={champion.image.replace("./", "/")}
                  alt={champion.name}
                  width={48}
                  height={48}
                  className="rounded mb-2"
                />
                <p className="text-xs text-center">{champion.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
