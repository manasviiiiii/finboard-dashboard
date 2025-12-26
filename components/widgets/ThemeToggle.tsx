"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    // Apply theme to <html>
    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    // On first load: read from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;

        const initialTheme: Theme = savedTheme ?? "light";
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const nextTheme: Theme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="px-3 py-1 border rounded-md text-sm
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 transition-colors"
        >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
