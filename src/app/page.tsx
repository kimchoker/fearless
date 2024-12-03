"use client";

import { useBanpickStore } from "@/store/banpickStore";
import Image from "next/image";

export default function BroadcastPage() {
  const games = useBanpickStore((state) => state.games); // games 상태를 직접 사용

  const gameEntries = Object.entries(games);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-[#D6E4F0] text-black p-4"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="flex w-full max-w-7xl justify-between">
        {/* 레드 팀 */}
        <div className="flex flex-col items-end w-1/3 space-y-2">
          
          {Array.from({ length: Math.ceil(gameEntries.length / 2) }).map((_, rowIndex) => {
            const rowGames = gameEntries.slice(rowIndex * 2, rowIndex * 2 + 2);
            return (
              <div key={rowIndex} className="flex gap-8">
                {rowGames.map(([gameId, gameData]) => (
                  <div key={gameId} className="text-right font-nexon font-bold">
                    <h2 className="font-bold">{gameId.toUpperCase()}</h2>
                    <div className="grid grid-cols-5 gap-1">
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
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* 중앙 로고 */}
        <div className="flex flex-col items-center w-1/3">
          <Image src="/logo.png" alt="Logo" width={128} height={128} className="rounded" />
        </div>

        {/* 블루 팀 */}
        <div className="flex flex-col items-start w-1/3 space-y-2">
         
          {Array.from({ length: Math.ceil(gameEntries.length / 2) }).map((_, rowIndex) => {
            const rowGames = gameEntries.slice(rowIndex * 2, rowIndex * 2 + 2);
            return (
              <div key={rowIndex} className="flex gap-8">
                {rowGames.map(([gameId, gameData]) => (
                  <div key={gameId} className="text-left">
                    <h2 className="font-bold font-nexon">{gameId.toUpperCase()}</h2>
                    <div className="grid grid-cols-5 gap-1">
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
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
