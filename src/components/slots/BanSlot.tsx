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
      className={`relative w-16 h-16 bg-white border rounded overflow-hidden ${pulseClass}`}
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
      {/* ripple 효과 */}
      {isRipple && <div className="ripple-effect"></div>}
    </div>
  );
};

export default BanSlot;
