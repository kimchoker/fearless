/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Champion, ChampionListProps } from "@/types/types";
import { ref, update } from "firebase/database";
import database from "@/firebase/firebase";
const ChampionList: React.FC<ChampionListProps> = ({
  champions,
  bannedChampions,
  pickedChampions,
  onChampionClick,
  onConfirmSelection,
  isDisabled,
  sessionId,
  currentPhase
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredChampions = champions.filter(
    (champion) =>
      champion.name.includes(searchText) &&
      !bannedChampions.some((banned) => banned.id === champion.id) &&
      !pickedChampions.some((picked) => picked.id === champion.id)
  );

  const handleChampionClick = (champion: Champion) => {
    if (
      !bannedChampions.some((banned) => banned.id === champion.id) &&
      !pickedChampions.some((picked) => picked.id === champion.id)
    ) {
      onChampionClick(champion);
      // Firebase에 업데이트
      update(ref(database, `sessions/${sessionId}/banpick`), {
        [`${currentPhase}/currentSelected`]: champion,
      });
    }
  };
  

  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-900">
      {/* 검색 입력 */}
      <div className="flex flex-row justify-between items-center w-full p-3">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="챔피언 검색"
          className="bg-gray-300 text-center py-2 px-6 rounded font-gong"
        />

        {/* 선택 완료 버튼 */}
        <button
          onClick={onConfirmSelection}
          className={`py-4 px-10 rounded font-gong text-xl transition-all ${
            isDisabled
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
          disabled={isDisabled} // 버튼 비활성화
        >
          선택 완료
        </button>
      </div>
      

      {/* 챔피언 리스트 */}
      <div className="grid grid-cols-10 gap-4 text-center py-4 px-6 rounded max-h-[700px] overflow-y-auto font-gong ">
        {filteredChampions.map((champion) => (
            <div
              key={champion.id}
              className={`flex flex-col items-center justify-center cursor-pointer ${
                isDisabled ||
                bannedChampions.some((banned) => banned.id === champion.id) ||
                pickedChampions.some((picked) => picked.id === champion.id)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-80"
              }`}
              onClick={() => handleChampionClick(champion)}
            >
              <img
                src={champion.image.replace("./", "/")}
                alt={champion.name}
                className="w-16 h-16 rounded"
              />
              <p className="text-sm text-white">{champion.name}</p>
            </div>
          ))}
      </div>

      
    </div>
  );
};

export default ChampionList;
