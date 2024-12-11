/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Champion } from "@/types/types";

interface ChampionListProps {
  champions: Champion[];
  bannedChampions: Champion[];
  pickedChampions: Champion[];
  onChampionClick: (champion: Champion) => void;
  onConfirmSelection: () => void;
}

const ChampionList: React.FC<ChampionListProps> = ({
  champions,
  bannedChampions,
  pickedChampions,
  onChampionClick,
  onConfirmSelection,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredChampions = champions.filter(
    (champion) =>
      champion.name.includes(searchText) &&
      !bannedChampions.some((banned) => banned.id === champion.id) &&
      !pickedChampions.some((picked) => picked.id === champion.id)
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 검색 입력 */}
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="챔피언 검색"
        className="bg-gray-300 text-center py-2 px-6 rounded"
      />

      {/* 챔피언 리스트 */}
      <div className="grid grid-cols-10 gap-4 bg-gray-700 text-center py-4 px-6 rounded max-h-[600px] overflow-y-auto font-gong ">
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
                !bannedChampions.some((banned) => banned.id === champion.id) &&
                !pickedChampions.some((picked) => picked.id === champion.id)
              ) {
                onChampionClick(champion);
              }
            }}
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

      {/* 선택 완료 버튼 */}
      <button
        onClick={onConfirmSelection}
        className="bg-gray-700 text-white py-4 px-10 rounded font-gong text-xl"
      >
        선택 완료
      </button>
    </div>
  );
};

export default ChampionList;
