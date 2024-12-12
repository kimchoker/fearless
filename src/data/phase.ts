import { PhaseOrder } from "@/types/types";


export const phaseOrder: PhaseOrder = {
  ban1: [
    { team: "blue", turn: 0, key: "1", ripple: "0" },
    { team: "red", turn: 0, key: "2", ripple: "1" },
    { team: "blue", turn: 1, key: "3", ripple: "2" },
    { team: "red", turn: 1, key: "4", ripple: "3" },
    { team: "blue", turn: 2, key: "5", ripple: "4" },
    { team: "red", turn: 2, key: "6", ripple: "5" },
  ],
  pick1: [
    { team: "blue", turn: 0, key: "7", ripple: "6" },
    { team: "red", turn: 0, key: "8", ripple: "7" },
    { team: "red", turn: 1, key: "9", ripple: "8" },
    { team: "blue", turn: 1, key: "10", ripple: "9" },
    { team: "blue", turn: 2, key: "11", ripple: "10" },
    { team: "red", turn: 2, key: "12", ripple: "11" },
  ],
  ban2: [
    { team: "red", turn: 3, key: "13", ripple: "12" },
    { team: "blue", turn: 3, key: "14", ripple: "13" },
    { team: "red", turn: 4, key: "15", ripple: "14" },
    { team: "blue", turn: 4, key: "16", ripple: "15" },
  ],
  pick2: [
    { team: "red", turn: 3, key: "17", ripple: "16" },
    { team: "blue", turn: 3, key: "18", ripple: "17" },
    { team: "blue", turn: 4, key: "19", ripple: "18" },
    { team: "red", turn: 4, key: "20", ripple: "19" },
    
  ],
  complete: [
    { team: "red", turn: 5, key: "21", ripple: "20" }
  ],
};

