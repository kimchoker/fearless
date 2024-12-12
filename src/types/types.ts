export interface Champion {
  id: number;
  name: string;
  image: string;
  pickimg?: string;
}

export interface PhaseTurn {
  team: "blue" | "red";
  turn: number;
  key: string;
  ripple: string;
}

export interface PhaseOrder {
  ban1: PhaseTurn[];
  pick1: PhaseTurn[];
  ban2: PhaseTurn[];
  pick2: PhaseTurn[];
  complete: PhaseTurn[];
}

// 밴 페이즈
export type PhaseType = "ban1" | "pick1" | "ban2" | "pick2" | "complete";

// 밴 슬롯 props
export interface BanSlotProps {
  slotData: Champion | null; // 슬롯에 들어갈 챔피언 데이터
  isCurrentTurn: boolean; // 현재 턴에 해당하는 슬롯인지 여부
  selectedChampion: Champion | null; // 선택 중인 챔피언(로컬)
  currentSelected: Champion | null; // 선택 중인 챔피언(실시간)
}

// 픽 슬롯 props
export interface PickSlotProps {
  playerName: string; // 선수 이름
  slotData: Champion | null; // 슬롯에 들어갈 챔피언 데이터
  isCurrentTurn: boolean; // 현재 턴에 해당하는 슬롯인지 여부
  selectedChampion: Champion | null; // 선택 중인 챔피언(로컬)
  currentSelected: Champion | null; // 선택 중인 챔피언(실시간)
  isRipple: boolean;
}

// session 생성 후 제공되는 Link
export interface Links {
  redLink: string;
  blueLink: string;
  spectatorLink: string;
}


export interface SessionData {
  teamRed: string[];
  teamBlue: string[];
  bans: { red: (Champion | null)[]; blue: (Champion | null)[] };
  picks: { red: (Champion | null)[]; blue: (Champion | null)[] };
  currentPhase: string;
  currentTurn: number;
  status: string;
  spectators: string[];
}

export interface BanpickUIProps {
  bannedChampions: Champion[];
  pickedChampions: Champion[];
  onChampionSelect: (champion: Champion | null) => void;
}

export interface Player {
  nickname: string;
  connected: boolean;
}

export interface BroadcastPageProps {
  logo: string; // 로고 이미지 경로를 props로 받음
}

export interface LogoState {
  logo: string | null; 
  setLogo: (logo: string) => void;
}

export interface ChampionListProps {
  champions: Champion[];
  bannedChampions: Champion[];
  pickedChampions: Champion[];
  onChampionClick: (champion: Champion) => void;
  onConfirmSelection: () => void;
  isDisabled: boolean;
  sessionId: string;
  currentPhase: string;
}
