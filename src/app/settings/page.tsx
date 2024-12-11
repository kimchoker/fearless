/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import champions from "../../../public/champions.json";
import { useBanpickStore } from "@/store/banpickStore";
import { Champion } from "@/types/types";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { games, addGame, deleteGame, addChampionToTeam, removeChampionFromTeam } =
    useBanpickStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);

  // 초기 정렬 및 상태 설정
  useEffect(() => {
    const sortedChampions = [...champions].sort((a, b) =>
      a.name.localeCompare(b.name, "ko-KR")
    );
    setAvailableChampions(sortedChampions);
  }, []);

  useEffect(() => {
    const unsubscribe = useBanpickStore.subscribe((state) => state.games);
    return () => unsubscribe(); // 구독 해제
  }, []);

  const filteredChampions = availableChampions.filter((champion) =>
    champion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = (team: "red" | "blue", gameId: string, champion: Champion) => {
    // 모든 게임 데이터에서 중복 확인
    const isDuplicate = Object.values(games).some((game) => {
      return game.red.some((member) => member.id === champion.id) || 
             game.blue.some((member) => member.id === champion.id);
    });
  
    if (isDuplicate) {
      alert("이미 다른 게임에서 선택된 챔피언입니다.");
      return; // 중복된 경우 추가하지 않음
    }
  
    addChampionToTeam(gameId, team, champion); // zustand 상태 업데이트
    setAvailableChampions((prev) => prev.filter((c) => c.id !== champion.id)); // 로컬 상태 업데이트
  };
  

  const handleRemoveFromTeam = (team: "red" | "blue", gameId: string, champion: Champion) => {
    removeChampionFromTeam(gameId, team, champion); // zustand 상태 업데이트
    setAvailableChampions((prev) =>
      [...prev, champion].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
    );
  };

  const handleDeleteGame = (gameId: string) => {
    const gameData = games[gameId]; // 삭제할 게임 데이터 가져오기
    if (gameData) {
      // 게임 내 챔피언들을 다시 목록으로 복구
      const championsToRestore = [...gameData.red, ...gameData.blue];
      setAvailableChampions((prev) =>
        [...prev, ...championsToRestore].sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
      );
    }

    deleteGame(gameId); // 게임 삭제
  };

  const [logo, setLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");


  const handleMoveToFearless = () => {
    router.push("/fearless"); // 로고를 zustand에서 가져올 예정
  };

  const swapTeams = () => {
    const updatedGames = { ...games };
  
    Object.keys(updatedGames).forEach((gameId) => {
      const game = updatedGames[gameId];
      const redTeam = game.red || [];
      const blueTeam = game.blue || [];
  
      // Swap teams
      updatedGames[gameId].red = blueTeam;
      updatedGames[gameId].blue = redTeam;
    });
  
    // Zustand store 업데이트
    useBanpickStore.setState({ games: updatedGames });
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white p-6 font-gong">
      {/* 상단 메뉴 */}
      <div className="flex flex-col justify-start mb-6">
        <h1 className="text-2xl font-bold mb-10">피어리스 이미지 설정 페이지</h1>
        {/* 이미지 페이지로 이동 */}
        <div className="flex justify-end">
            <button className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 max-h-10"
            onClick={handleMoveToFearless}
            >
              피어리스 이미지 페이지 이동
            </button>
          </div>
      </div>
      <div className="flex flex-row justify-end items-end py-3">
        <button
          onClick={swapTeams}
          className="ml-4 p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mb-2 w-20"
        >
          팀 교체
        </button>
        <button
          onClick={addGame}
          className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2 w-20"
        >
          게임 추가
        </button>
      </div>
    
    

      {/* 게임별 팀 탭 */}
      {Object.keys(games).map((gameId) => (
        <div key={gameId} className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">{gameId}</h2>
            <button
              onClick={() => handleDeleteGame(gameId)} // 게임 삭제 처리
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              게임 삭제
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Red Team */}
            <div className="bg-red-700 p-4 rounded">
              <h3 className="text-lg mb-2">Red Team</h3>
              <div
                className="grid grid-cols-5 gap-2 min-h-[80px] bg-red-700 p-2 rounded"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const champion = JSON.parse(e.dataTransfer.getData("champion"));
                  handleDrop("red", gameId, champion);
                }}
              >
                {games[gameId]?.red?.map((champion) => (
                  <div
                    key={champion.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "champion",
                        JSON.stringify({ ...champion, fromTeam: { team: "red", gameId } })
                      )
                    }
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
            <div className="bg-blue-700 p-4 rounded">
              <h3 className="text-lg mb-2">Blue Team</h3>
              <div
                className="grid grid-cols-5 gap-2 min-h-[80px] bg-blue-700 p-2 rounded"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const champion = JSON.parse(e.dataTransfer.getData("champion"));
                  handleDrop("blue", gameId, champion);
                }}
              >
                {games[gameId]?.blue?.map((champion) => (
                  <div
                    key={champion.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "champion",
                        JSON.stringify({ ...champion, fromTeam: { team: "blue", gameId } })
                      )
                    }
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
            className="p-2 w-64 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
          />
        </div>

        <div
          className="grid grid-cols-12 gap-1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const data = JSON.parse(e.dataTransfer.getData("champion"));
            if (data.fromTeam) {
              handleRemoveFromTeam(data.fromTeam.team, data.fromTeam.gameId, data);
            }
          }}
        >
          {filteredChampions.map((champion) => (
            <div
              key={champion.id}
              className="flex flex-col items-center hover:bg-gray-800 cursor-pointer p-2 rounded"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("champion", JSON.stringify(champion))
              }
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
  );
}
