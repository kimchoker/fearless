import { PhaseOrder } from "@/types/types";


export const phaseOrder: PhaseOrder = {
  ban1: [
    { team: "blue", turn: 0 },
    { team: "red", turn: 0 },
    { team: "blue", turn: 1 },
    { team: "red", turn: 1 },
    { team: "blue", turn: 2 },
    { team: "red", turn: 2 },
  ],
  pick1: [
    { team: "blue", turn: 0 },
    { team: "red", turn: 0 },
    { team: "red", turn: 1 },
    { team: "blue", turn: 1 },
    { team: "blue", turn: 2 },
    { team: "red", turn: 2 },
  ],
  ban2: [
    { team: "red", turn: 3 },
    { team: "blue", turn: 3 },
    { team: "red", turn: 4 },
    { team: "blue", turn: 4 },
  ],
  pick2: [
    { team: "red", turn: 3 },
    { team: "blue", turn: 3 },
    { team: "blue", turn: 4 },
    { team: "red", turn: 4 },
  ],
  complete: [
    
  ]
};
