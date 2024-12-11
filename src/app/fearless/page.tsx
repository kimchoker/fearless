/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useBanpickStore } from "@/store/banpickStore";
import { useLogoStore } from "@/store/logoStore";
import Image from "next/image";
import html2canvas from "html2canvas";

export default function BroadcastPage() {
  const games = useBanpickStore((state) => state.games);
  const gameEntries = Object.entries(games);
  const { logo, setLogo } = useLogoStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(logo);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogo(previewUrl);
    }
  };

  const handleCaptureAndSave = async () => {
    const captureElement = document.getElementById("broadcast-capture-area");
    if (!captureElement) {
      alert("캡처할 영역을 찾을 수 없습니다.");
      return;
    }

    const canvas = await html2canvas(captureElement, {
      width: 1920,
      height: 400,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "broadcast_capture.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-gray-700 text-white p-4 font-gong"
    >
      {/* 방송 화면 영역 */}
      <div
        id="broadcast-capture-area"
        className="grid grid-cols-3 w-[1920px] h-[200px] bg-gray-700 px-10 justify-between items-start"
      >
        {/* 왼쪽 (블루 팀) */}
        <div className="grid grid-cols-2 grid-rows-2 w-full gap-y-2">
          {gameEntries.map(([gameId, gameData]) => (
            <div key={gameId} className="text-left">
              <h2>{gameId.toUpperCase()}</h2>
              <div className="flex flex-row">
                {[...Array(5)].map((_, index) => {
                  const champion = gameData.blue[index];
                  return champion ? (
                    <Image
                      key={`blue-${gameId}-${champion.id}`} // 고유 키 생성
                      src={champion.image.replace("./", "/")}
                      alt={champion.name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  ) : (
                    <div
                      key={`blue-slot-${gameId}-${index}`} // 빈 슬롯에도 고유 키 생성
                      className="w-10 h-10 bg-gray-300 border rounded"
                    />
                  );
                })}
              </div>
            </div>
          ))}

        </div>

        {/* 중앙 로고 */}
        <div className="flex justify-center items-center w-full">
          {logoPreview ? (
            <img src={logoPreview} alt="로고" className="w-36 h-36 rounded" />
          ) : (
            <p>로고 없음</p>
          )}
        </div>

        {/* 오른쪽 (레드 팀) */}
        <div className="grid grid-cols-2 grid-rows-2 w-full gap-y-2">
        {gameEntries.map(([gameId, gameData]) => (
          <div key={gameId} className="text-left">
            <h2>{gameId.toUpperCase()}</h2>
            <div className="flex flex-row">
              {[...Array(5)].map((_, index) => {
                const champion = gameData.red[index];
                return champion ? (
                  <Image
                    key={`red-${gameId}-${champion.id}`} // 고유 키 생성
                    src={champion.image.replace("./", "/")}
                    alt={champion.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                ) : (
                  <div
                    key={`red-slot-${gameId}-${index}`} // 빈 슬롯에도 고유 키 생성
                    className="w-10 h-10 bg-gray-300 border rounded"
                  />
                );
              })}
            </div>
          </div>
        ))}

        </div>
      </div>

      {/* UI 하단 */}
      <div className="flex flex-col items-center space-y-4 mt-8">
        {/* 로고 업로드 */}
        <label className="bg-gray-400 px-4 py-2 rounded cursor-pointer hover:bg-gray-900">
          로고 업로드하기
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </label>

        {/* 캡처 저장 버튼 */}
        <button
          onClick={handleCaptureAndSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          화면 캡처 저장하기
        </button>
      </div>
    </div>
  );
}
