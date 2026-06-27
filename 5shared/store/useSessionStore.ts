import { create } from "zustand";

type SessionStore = {
  isBanned: boolean;
  setBanned: (value: boolean) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  isBanned: false,
  setBanned: (value) => set({ isBanned: value }),
}));
