"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useWidgetStore } from "@/store/useWidgetStore";

export default function Home() {
    const widgets = useWidgetStore((state) => state.widgets);
    const count = widgets.length;

    return (
        <main className="min-h-screen p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShowChartIcon /> FinBoard Dashboard
            </h1>

            {/* Dynamic subtitle */}
            {count === 0 ? (
                <p className="text-gray-600 mt-2">
                    Connect to APIs and build your customizable dashboard
                </p>
            ) : (
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <span className="font-medium">
                        {count} active widget{count > 1 ? "s" : ""}
                    </span>
                    <span className="text-xl">•</span>
                    <span className="text-green-600 font-medium">
                        real-time data
                    </span>
                </p>
            )}

            <Dashboard />
        </main>
    );
}
