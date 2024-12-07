import React from "react";
import { BanSlotProps } from "@/types/types";

const BanSlot: React.FC<BanSlotProps & { isRipple: boolean }> = ({
  slotData,
  isCurrentTurn,
  selectedChampion,
  isRipple,
}) => {
  // `pulse-animation` 클래스는 isCurrentTurn에 따라 추가
  const pulseClass = isCurrentTurn ? "pulse-animation" : "";

  return (
    <div
      className={`relative w-20 h-20 min-w-20 min-h-20 bg-gray-700 overflow-hidden space-x-1 ${pulseClass}`}
      style={{
        backgroundImage: slotData
          ? `url(${slotData.image.replace("./", "/")})`
          : isCurrentTurn && selectedChampion
          ? `url(${selectedChampion.image.replace("./", "/")})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 대각선 선 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0, // 챔피언 이미지 뒤로 보내기
        }}
      >
        <div
          className="absolute w-[200%] h-[1px] bg-gray-500"
          style={{
            transform: "rotate(45deg)",
            top: "50%",
            left: "-50%",
          }}
        ></div>
      </div>

      {/* ripple 효과 */}
      {isRipple && <div className="ripple-effect"></div>}
    </div>
  );
};

export default BanSlot;
