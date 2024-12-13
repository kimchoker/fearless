/* eslint-disable @next/next/no-img-element */
"use client";

// import { useState } from "react";
import { useBanpickStore } from "@/store/banpickStore";
// import { useLogoStore } from "@/store/logoStore";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useState } from "react";

export default function BroadcastPage() {
  const games = useBanpickStore((state) => state.games);
  const gameEntries = Object.entries(games);
  const [showChampionNames, setShowChampionNames] = useState(false);

  const toggleChampionNames = () => {
    setShowChampionNames((prev) => !prev);
  };

  const handleCaptureAndSave = async () => {
    const captureElement = document.getElementById("broadcast-capture-area");
    if (!captureElement) {
      alert("캡처할 영역을 찾을 수 없습니다.");
      return;
    }

    const rect = captureElement.getBoundingClientRect();
    const canvas = await html2canvas(captureElement, {
      width: rect.width,
      height: rect.height,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "broadcast_capture.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-gray-700 text-white font-gong"
    >
      {/* 방송 화면 영역 */}
      <div
        id="broadcast-capture-area"
        className='flex bg-gray-700 items-center justify-center mb-10'
      >

        {/* 왼쪽 (블루 팀) */}
        <div className="flex flex-col w-full gap-y-4 p-10 items-center">
          <h1 className="text-2xl font-bold text-blue-500">BLUE</h1>
          {gameEntries.map(([gameId, gameData]) => (
            <div key={gameId} className="text-right">
              <h2>{gameId.toUpperCase()}</h2>
              <div className="flex flex-row p-2">
                {[...Array(5)].map((_, index) => {
                  const champion = gameData.blue[index];
                  return champion ? (
                    <div key={`blue-${gameId}-${champion.id}`} className="flex flex-col items-center">
                      <Image
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={60}
                        height={60}
                        className="rounded min-w-[50px] min-h-[50px]"
                      />
                      {showChampionNames && <p className="text-xs mt-1">{champion.name}</p>}
                    </div>
                  ) : (
                    <div
                      key={`blue-slot-${gameId}-${index}`} // 빈 슬롯에도 고유 키 생성
                      className="w-[60px] h-[60px] bg-gray-800 border-gray-400 rounded min-w-[60px] min-h-[60px]"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 중앙 로고 */}
        {/* <div className='flex justify-center items-center w-full'>
          {logoPreview ? (
            <img src={logoPreview} alt="" className="w-36 h-36 rounded" />
          ) : (
            <div className="w-36 h-36"></div>
          )}
        </div> */}

        {/* 오른쪽 (레드 팀) */}
        <div className="flex flex-col w-full gap-y-4 px-10 p-10 items-center">
          <h1 className="text-2xl font-bold text-red-500">RED</h1>
          {gameEntries.map(([gameId, gameData]) => (
            <div key={gameId} className="text-left">
              <h2>{gameId.toUpperCase()}</h2>
              <div className="flex flex-row p-2">
                {[...Array(5)].map((_, index) => {
                  const champion = gameData.red[index];
                  return champion ? (
                    <div key={`red-${gameId}-${champion.id}`} className="flex flex-col items-center">
                      <Image
                        src={champion.image.replace("./", "/")}
                        alt={champion.name}
                        width={60}
                        height={60}
                        className="rounded"
                      />
                      {showChampionNames && <p className="text-xs mt-1">{champion.name}</p>}
                    </div>
                  ) : (
                    <div
                      key={`red-slot-${gameId}-${index}`} // 빈 슬롯에도 고유 키 생성
                      className="w-[60px] h-[60px] bg-gray-800 border-gray-400 rounded min-w-[60px] min-h-[60px]"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UI 하단 */}
      <div className="flex flex-col items-center justify-center space-y-4 mt-8">
        {/* 챔피언 이름 토글 버튼 */}
        <button
          onClick={toggleChampionNames}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {showChampionNames ? "챔피언 이름 숨기기" : "챔피언 이름 보기"}
        </button>

        {/* 캡처 저장 버튼 */}
        <button
          onClick={handleCaptureAndSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          피어리스 이미지로 저장
        </button>

         {/* 설정 페이지로 돌아가기 버튼 */}
         <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => window.location.href = "/settings"}
        >
          설정 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
