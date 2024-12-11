'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Champion {
  id: number;
  name: string;
  image: string;
}

interface GameState {
  games: {
    [gameId: string]: { red: Champion[]; blue: Champion[] };
  };
  addGame: () => void;
  deleteGame: (gameId: string) => void;
  addChampionToTeam: (gameId: string, team: "red" | "blue", champion: Champion) => void;
  removeChampionFromTeam: (gameId: string, team: "red" | "blue", champion: Champion) => void;
  setGames: (games: { [key: string]: { red: Champion[]; blue: Champion[] } }) => void;
}

export const useBanpickStore = create(
  persist<GameState>(
    (set) => ({
      games: {},

      addGame: () =>
        set((state) => {
          const newGameId = `Game ${Object.keys(state.games).length + 1}`;
          console.log(`Adding game: ${newGameId}`);
          return { games: { ...state.games, [newGameId]: { red: [], blue: [] } } };
        }),

      deleteGame: (gameId) =>
        set((state) => {
          const updatedGames = { ...state.games };
          delete updatedGames[gameId];

          const reorderedGames = Object.entries(updatedGames)
            .sort(([a], [b]) => parseInt(a.replace("Game", "")) - parseInt(b.replace("Game", "")))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .reduce((acc, [key, value], index) => {
              acc[`Game${index + 1}`] = value;
              return acc;
            }, {} as { [key: string]: { red: Champion[]; blue: Champion[] } });

          console.log(`Deleting game: ${gameId}`);
          return { games: reorderedGames };
        }),

      addChampionToTeam: (gameId, team, champion) =>
        set((state) => {
          console.log(`Adding champion to ${team} in ${gameId}:`, champion);
          const updatedGame = state.games[gameId];
          const updatedTeam = [...updatedGame[team], champion];
          return {
            games: {
              ...state.games,
              [gameId]: { ...updatedGame, [team]: updatedTeam },
            },
          };
        }),

      removeChampionFromTeam: (gameId, team, champion) =>
        set((state) => {
          console.log(`Removing champion from ${team} in ${gameId}:`, champion);
          const updatedGame = state.games[gameId];
          const updatedTeam = updatedGame[team].filter((c) => c.id !== champion.id);
          return {
            games: {
              ...state.games,
              [gameId]: { ...updatedGame, [team]: updatedTeam },
            },
          };
        }),

      setGames: (games) =>
        set(() => {
          console.log("Setting games:", games);
          return { games };
        }),
    }),
    {
      name: "banpick-storage", // localStorage에 저장될 키
      storage: createJSONStorage(() => localStorage), // JSON 포맷으로 localStorage 사용
    }
  )
);
