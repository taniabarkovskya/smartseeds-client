import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/entities/user/model/types";
import type { Task } from "@/entities/course/model/types";
import type { CompetencyVectorValues } from "@/shared/lib/adaptiveAlgorithm";

interface AppStore {
  user: User | null;
  vector: CompetencyVectorValues | null;
  currentTask: Task | null;
  lastScore: number | null;
  setUser: (u: User | null) => void;
  setVector: (v: CompetencyVectorValues) => void;
  setCurrentTask: (t: Task) => void;
  setLastScore: (s: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  vector: null,
  currentTask: null,
  lastScore: null,
  setUser: (user) => set({ user }),
  setVector: (vector) => set({ vector }),
  setCurrentTask: (currentTask) => set({ currentTask }),
  setLastScore: (lastScore) => set({ lastScore }),
}));

interface FavoritesStore {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((x) => x !== id)
            : [...state.favoriteIds, id],
        })),
    }),
    { name: "smartseeds-favorites" },
  ),
);