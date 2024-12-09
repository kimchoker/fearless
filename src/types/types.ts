export interface Champion {
  id: number;
  name: string;
  image: string;
  pickimg: string;
}

export interface PhaseTurn {
  team: "blue" | "red";
  turn: number;
}

export interface PhaseOrder {
  ban1: PhaseTurn[];
  pick1: PhaseTurn[];
  ban2: PhaseTurn[];
  pick2: PhaseTurn[];
  complete: PhaseTurn[];
}

export type PhaseType = "ban1" | "pick1" | "ban2" | "pick2" | "complete";


export interface BanSlotProps {
  slotData: Champion | null; // 슬롯에 들어갈 챔피언 데이터
  isCurrentTurn: boolean; // 현재 턴에 해당하는 슬롯인지 여부
  selectedChampion: Champion | null; // 선택 중인 챔피언 (임시 이미지)
}

export interface PickSlotProps {
  playerName: string; // 선수 이름
  slotData: Champion | null; // 슬롯에 들어갈 챔피언 데이터
  isCurrentTurn: boolean; // 현재 턴에 해당하는 슬롯인지 여부
  selectedChampion: Champion | null; // 선택 중인 챔피언 (임시 이미지)
}