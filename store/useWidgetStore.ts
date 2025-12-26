import { create } from "zustand";
import { Widget } from "@/types/widget";

interface WidgetStore {
    widgets: Widget[];
    addWidget: (widget: Widget) => void;
    removeWidget: (id: string) => void;
    loadWidgets: () => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
    widgets: [],

    addWidget: (widget) =>
        set((state) => {
            const updated = [...state.widgets, widget];
            localStorage.setItem("finboard_widgets", JSON.stringify(updated));
            return { widgets: updated };
        }),

    removeWidget: (id) =>
        set((state) => {
            const updated = state.widgets.filter((w) => w.id !== id);
            localStorage.setItem("finboard_widgets", JSON.stringify(updated));
            return { widgets: updated };
        }),

    loadWidgets: () => {
        const saved = localStorage.getItem("finboard_widgets");
        if (saved) {
            set({ widgets: JSON.parse(saved) });
        }
    },
}));
