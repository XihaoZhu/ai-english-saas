import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeStore = {
    theme: Theme;
    toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "light",
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "dark" ? "light" : "dark",
                })),
        }),
        {
            name: "theme",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
