"use client";

import { useEffect, useState } from "react";
import { useWidgetStore } from "@/store/useWidgetStore";
import WidgetCard from "@/components/widgets/WidgetCard";
import AddWidgetModal from "@/components/modals/AddWidgetModal";
import ThemeToggle from "@/components/widgets/ThemeToggle";

export default function Dashboard() {
    const widgets = useWidgetStore((state) => state.widgets);
    const loadWidgets = useWidgetStore((state) => state.loadWidgets);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadWidgets();
    }, [loadWidgets]);

    return (
        <section className="mt-6 min-h-screen bg-gray-100 dark:bg-gray-950 px-1">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h2>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                        + Add Widget
                    </button>
                </div>
            </div>

            {/* Widgets */}
            {widgets.length === 0 ? (
                <div className="mt-4 border border-dashed p-6 text-gray-500 dark:text-gray-400 dark:border-gray-700">
                    No widgets added yet.
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {widgets.map((widget) => (
                        <WidgetCard key={widget.id} widget={widget} />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddWidgetModal onClose={() => setShowModal(false)} />
            )}
        </section>
    );
}
