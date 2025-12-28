"use client";

import { useEffect, useState } from "react";
import { useWidgetStore } from "@/store/useWidgetStore";
import WidgetCard from "@/components/widgets/WidgetCard";
import AddWidgetModal from "@/components/modals/AddWidgetModal";
import ThemeToggle from "@/components/widgets/ThemeToggle";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function Dashboard() {
    const widgets = useWidgetStore((state) => state.widgets);
    const loadWidgets = useWidgetStore((state) => state.loadWidgets);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadWidgets();
    }, [loadWidgets]);

    const hasWidgets = widgets.length > 0;

    return (
        <section className="mt-6 min-h-screen bg-gray-100 dark:bg-gray-950 px-1">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div
                    className="
                        flex items-center gap-3 ml-auto
                        bg-white dark:bg-gray-900
                        border dark:border-gray-800
                        rounded-lg px-3 py-2
                    "
                >
                    <ThemeToggle />

                    {!hasWidgets && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            + Add Widget
                        </button>
                    )}
                </div>
            </div>

            {/* Widgets Area */}
            {widgets.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center text-center px-6">
                    <BarChartIcon
                        className="text-blue-600 mb-4"
                        sx={{ fontSize: 64 }}
                    />

                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Create Custom Widgets by connecting to APIs
                    </p>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                        Track Stocks, Crypto, Forex or economic indicators — all
                        in real time.
                    </p>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Existing widgets */}
                    {widgets.map((widget) => (
                        <WidgetCard key={widget.id} widget={widget} />
                    ))}

                    {/* Add Widget behaves like a normal widget */}
                    <div
                        onClick={() => setShowModal(true)}
                        className="
                            cursor-pointer
                            border-2 border-dashed border-gray-400 dark:border-gray-600
                            rounded-lg p-6
                            flex flex-col items-center justify-center
                            text-center
                            hover:border-blue-500 hover:bg-blue-50
                            dark:hover:bg-gray-900
                            transition
                        "
                    >
                        <AddIcon
                            className="text-blue-600 mb-3"
                            fontSize="large"
                        />

                        <p className="font-bold text-gray-800 dark:text-gray-100">
                            ADD WIDGET
                        </p>

                        <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                            Connect to financial API and create a custom widget
                        </p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddWidgetModal onClose={() => setShowModal(false)} />
            )}
        </section>
    );
}
