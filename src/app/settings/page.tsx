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

  // 초기 상태 설정
  useEffect(() => {
    const sortedChampions = [...champions].sort((a, b) =>
      a.name.localeCompare(b.name, "ko-KR")
    );
    setAvailableChampions(sortedChampions);
  }, []);
  
  useEffect(() => {
    const usedChampionIds = new Set();
  
    Object.values(games).forEach((game) => {
      game.red.forEach((champion) => usedChampionIds.add(champion.id));
      game.blue.forEach((champion) => usedChampionIds.add(champion.id));
    });
  
    const filteredChampions = champions.filter(
      (champion) => !usedChampionIds.has(champion.id)
    );
    setAvailableChampions(
      filteredChampions.sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
    );
  }, [games]);
  

  const handleDrop = (team: "red" | "blue", gameId: string, champion: Champion) => {
    const isDuplicate = Object.values(games).some((game) =>
      game.red.some((member) => member.id === champion.id) ||
      game.blue.some((member) => member.id === champion.id)
    );

    if (isDuplicate) {
      alert("이미 다른 게임에서 선택된 챔피언입니다.");
      return;
    }

    addChampionToTeam(gameId, team, champion);
    setAvailableChampions((prev) =>
      prev.filter((c) => c.id !== champion.id)
    );
  };

  const handleRemoveFromTeam = (team: "red" | "blue", gameId: string, champion: Champion) => {
    removeChampionFromTeam(gameId, team, champion);
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

    deleteGame(gameId);
  };

  const handleMoveToFearless = () => {
    router.push("/fearless");
  };

  const swapTeams = () => {
    // 현재 게임 데이터를 복사
    const updatedGames = { ...games };
  
    // 모든 게임 데이터를 순회하면서 팀 교환
    Object.keys(updatedGames).forEach((gameId) => {
      const game = updatedGames[gameId];
      const redTeam = game.red || [];
      const blueTeam = game.blue || [];
  
      // 팀 교체
      updatedGames[gameId].red = blueTeam;
      updatedGames[gameId].blue = redTeam;
    });
  
    // Zustand 상태 업데이트
    useBanpickStore.setState({ games: updatedGames });
  
    // 상태 변경 후 로컬 상태도 다시 필터링 및 정렬
    const usedChampionIds = new Set();
    Object.values(updatedGames).forEach((game) => {
      game.red.forEach((champion) => usedChampionIds.add(champion.id));
      game.blue.forEach((champion) => usedChampionIds.add(champion.id));
    });
  
    setAvailableChampions(
      champions
        .filter((champion) => !usedChampionIds.has(champion.id))
        .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-700 text-white p-6 font-gong">
      {/* 상단 메뉴 */}
      <div className="flex flex-row justify-between mb-6">
        <h1 className="text-2xl font-bold mb-5">피어리스 이미지 설정 페이지</h1>
        
          <button
            className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 max-h-10"
            onClick={handleMoveToFearless}
          >
            피어리스 이미지 페이지 이동
          </button>
        
      </div>

      <div className="flex flex-row justify-between py-3">
        <div className="py-1">
          <h1 className="text-xl mb-2">사용 방법</h1>
          <h3>게임을 모두 설정한 뒤 피어리스 페이지 버튼을 클릭해주세요</h3>
          <h3>팀 자리 바꾸기 버튼을 클릭하면 레드와 블루의 위치가 바뀝니다</h3>
          <h3>게임 수 제한은 딱히 설정 안해놨는데 일단은 5경기까지 된다고 생각하는게 좋을듯..?</h3>
          <h3>드래그 앤 드롭으로 동작합니다 원하는 챔피언을 끌어다 원하는 게임에 드롭하면 됩니다</h3>
          <h3>게임에서 챔피언을 삭제하고 싶다면 챔피언 이미지에 대고 마우스 오른쪽 버튼을 클릭해보세요</h3>
          <h3>한번 사용한 챔피언은 목록에서 사라집니다. 오른쪽 마우스 클릭하거나 게임 삭제 누르면 다시 목록으로 돌아옴</h3>
        </div>

        <div className="flex flex-col justify-end items-end">
          <button
            onClick={swapTeams}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mb-4"
          >
            팀 자리 바꾸기
          </button>
          <button
            onClick={addGame}
            className="ml-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2 w-20"
          >
            게임 추가
          </button>
        </div>
        
      </div>

      {/* 게임별 팀 탭 */}
      {Object.keys(games).map((gameId) => (
        <div key={gameId} className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">{gameId}</h2>
            <button
              onClick={() => handleDeleteGame(gameId)}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              게임 삭제
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Red Team */}
            <div className="bg-red-700 p-4 rounded">
              <h3 className="text-lg mb-2">Red</h3>
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
              <h3 className="text-lg mb-2">Blue</h3>
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
            placeholder="챔피언 이름 검색"
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
          {availableChampions.map((champion) => (
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
