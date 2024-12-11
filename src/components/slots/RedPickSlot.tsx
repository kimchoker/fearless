import React from "react";
import { PickSlotProps } from "@/types/types";

const RedPickSlot: React.FC<PickSlotProps & { isRipple: boolean }> = ({
  playerName,
  slotData,
  isCurrentTurn,
  selectedChampion,
  isRipple,
}) => {
  // 애니메이션 클래스 추가
  const pulseClass = isCurrentTurn ? "pulse-animation" : "";

  return (
    <div
      className={`relative bg-gray-700 h-40 flex items-center px-2 overflow-hidden ${pulseClass}`}
      style={{
        backgroundImage: slotData?.pickimg
          ? `url(${slotData.pickimg.replace("./", "/")})`
          : isCurrentTurn && selectedChampion?.pickimg
          ? `url(${selectedChampion.pickimg.replace("./", "/")})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 물결 효과 */}
      {isRipple && <div className="ripple-effect"></div>}

      {/* 선수 이름 - 레드 팀: 왼쪽 정렬 */}
      <div className="absolute left-2 text-white px-2 py-1 font-gong text-2xl flex flex-col items-start">
        <span className="text-sm">{slotData?.name}</span>
        <span>{playerName}</span>
      </div>
    </div>
  );
};

export default RedPickSlot;
