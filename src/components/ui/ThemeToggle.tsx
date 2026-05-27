"use client";

import { useThemeStore } from "@/src/store/useThemeStore";

export default function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    return (
        <button
            onClick={toggleTheme}
            className="rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-4 py-2 text-sm font-medium text-[color:var(--app-text)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            {theme === "dark" ? "Dark" : "Light"}
        </button>
    );
}
