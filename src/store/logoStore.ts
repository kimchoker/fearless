import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LogoState } from "@/types/types";

export const useLogoStore = create(
  persist<LogoState>(
    (set) => ({
      logo: null,
      setLogo: (logo) => set({ logo }),
    }),
    {
      name: "logo-storage", // 로컬 스토리지 키 이름
      storage: createJSONStorage(() => localStorage), // JSON 래퍼 사용
    }
  )
);
