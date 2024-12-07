"use client";

import { useState } from "react";
import champions from "../../../public/champions.json";

export default function BanpickUI() {
  const [redTeamNames, setRedTeamNames] = useState([
    "Doran",
    "Peanut",
    "Chovy",
    "Ruler",
    "Lehends",
  ]);
  const [blueTeamNames, setBlueTeamNames] = useState([
    "Rascal",
    "Cuzz",
    "Vicla",
    "Aiming",
    "Life",
  ]);
  const [searchText, setSearchText] = useState("");
  const [currentPhase, setCurrentPhase] = useState("ban1"); // ban1, pick1, ban2
  const [currentTurn, setCurrentTurn] = useState(0); // 현재 턴
  const [currentTeam, setCurrentTeam] = useState("blue"); // 현재 턴 팀
  const [banSlots, setBanSlots] = useState({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });
  const [pickSlots, setPickSlots] = useState({
    blue: Array(5).fill(null),
    red: Array(5).fill(null),
  });
  const [bannedChampions, setBannedChampions] = useState([]); // 이미 밴된 챔피언 저장
  const [pickedChampions, setPickedChampions] = useState([]); // 이미 픽된 챔피언 저장
  const [selectedChampion, setSelectedChampion] = useState(null);

  const handleChampionClick = (champion) => {
    if (
      bannedChampions.some((banned) => banned.id === champion.id) ||
      pickedChampions.some((picked) => picked.id === champion.id)
    )
      return; // 클릭 불가
    setSelectedChampion(champion);

    if (currentPhase.startsWith("ban")) {
      const updatedBanSlots = { ...banSlots };
      const slotIndex =
        currentPhase === "ban1"
          ? Math.floor(currentTurn / 2)
          : currentTurn - 6; // 밴2의 경우
      updatedBanSlots[currentTeam][slotIndex] = champion;
      setBanSlots(updatedBanSlots);
    } else if (currentPhase.startsWith("pick")) {
      const updatedPickSlots = { ...pickSlots };
      updatedPickSlots[currentTeam][Math.floor(currentTurn / 2)] = champion;
      setPickSlots(updatedPickSlots);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedChampion) return;

    if (currentPhase.startsWith("ban")) {
      setBannedChampions((prev) => [...prev, selectedChampion]);
    } else if (currentPhase.startsWith("pick")) {
      setPickedChampions((prev) => [...prev, selectedChampion]);
    }

    const nextTurn = currentTurn + 1;
    if (currentPhase === "ban1" && nextTurn >= 6) {
      setCurrentPhase("pick1");
      setCurrentTurn(0);
      setCurrentTeam("blue");
    } else if (currentPhase === "pick1" && nextTurn >= 6) {
      setCurrentPhase("ban2");
      setCurrentTurn(6);
      setCurrentTeam("red");
    } else if (currentPhase === "ban2" && nextTurn >= 10) {
      setCurrentPhase("complete");
    } else {
      setCurrentTurn(nextTurn);
      setCurrentTeam((prev) => (prev === "blue" ? "red" : "blue"));
    }

    setSelectedChampion(null);
  };

  const filteredChampions = champions.filter((champion) =>
    champion.name.includes(searchText)
  );

  return (
    <div className="min-h-screen bg-gray-200 text-black">
      {/* 상단 제목 및 타이머 */}
      <div className="flex justify-between items-center bg-gray-300 py-4 px-10">
        <div className="text-center">
          <h2 className="text-xl font-bold">피어리스 밴픽 UI</h2>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentPhase.toUpperCase()} PHASE</h2>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">GAME1</h2>
        </div>
      </div>

      {/* 메인 UI */}
      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full px-10">
          {/* 블루 팀 */}
          <div className="flex flex-col w-1/4">
            {/* 픽 칸 */}
            {blueTeamNames.map((name, index) => (
              <div
                key={index}
                className="bg-gray-700 h-24 flex justify-between items-center px-2"
                style={{
                  backgroundImage: pickSlots.blue[index]
                    ? `url(${pickSlots.blue[index].pickimg.replace("./", "/")})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              >
                <div className="text-center text-white px-2 py-1">{name}</div>
              </div>
            ))}
            {/* 밴 칸 */}
            <div className="bg-blue-100 text-center py-4 mt-4">
              <h3 className="text-lg">밴 페이즈</h3>
              <div className="flex justify-center space-x-4 mt-2">
                {banSlots.blue.map((ban, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-white border rounded flex items-center justify-center"
                  >
                    {ban && (
                      <img
                        src={ban.image.replace("./", "/")}
                        alt={ban.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 광고 자리 */}
          <div className="flex justify-center items-center bg-gray-600 w-1/2 h-96">
            <p className="text-xl">광고 자리 비워놔야함</p>
          </div>

          {/* 레드 팀 */}
          <div className="flex flex-col w-1/4">
            {/* 픽 칸 */}
            {redTeamNames.map((name, index) => (
              <div
                key={index}
                className="bg-gray-700 h-24 flex justify-between items-center px-2"
                style={{
                  backgroundImage: pickSlots.red[index]
                    ? `url(${pickSlots.red[index].pickimg.replace("./", "/")})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              >
                <div className="text-center text-white px-2 py-1">{name}</div>
              </div>
            ))}
            {/* 밴 칸 */}
            <div className="bg-blue-100 text-center py-4 mt-4">
              <h3 className="text-lg">밴 페이즈</h3>
              <div className="flex justify-center space-x-4 mt-2">
                {banSlots.red.map((ban, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-white border rounded flex items-center justify-center"
                  >
                    {ban && (
                      <img
                        src={ban.image.replace("./", "/")}
                        alt={ban.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 추가 UI */}
        <div className="flex w-full justify-between px-10 py-4">
          {/* 블루 팀 */}
          <div className="flex flex-col space-y-2">
            {blueTeamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                className="bg-gray-300 w-48 text-center py-2"
              />
            ))}
          </div>

          {/* 중앙 */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleConfirmSelection}
              className="bg-blue-500 text-white py-2 px-6 rounded"
            >
              선택 완료 버튼
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
                  onClick={() =>
                    !bannedChampions.some((banned) => banned.id === champion.id) &&
                    !pickedChampions.some((picked) => picked.id === champion.id)
                      ? handleChampionClick(champion)
                      : null
                  }
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

          {/* 레드 팀 */}
          <div className="flex flex-col space-y-2">
            {redTeamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                className="bg-gray-300 w-48 text-center py-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
