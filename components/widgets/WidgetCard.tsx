"use client";

import { useEffect, useState } from "react";
import { Widget } from "@/types/widget";
import { useWidgetStore } from "@/store/useWidgetStore";

import BarChartIcon from "@mui/icons-material/BarChart";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import TocIcon from "@mui/icons-material/Toc";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import LoopIcon from "@mui/icons-material/Loop";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface WidgetCardProps {
    widget: Widget;
}

export default function WidgetCard({ widget }: WidgetCardProps) {
    const removeWidget = useWidgetStore((state) => state.removeWidget);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);


    /* ---------- FETCH DATA ---------- */
    const fetchData = async () => {
    if (!widget.apiConfig.url) return;

    try {
        setLoading(true);
        setError(null);

        const res = await fetch(widget.apiConfig.url);
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json);

        // ✅ update last fetched time
        setLastUpdated(new Date());
    } catch (err: any) {
        setError(err.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchData();

        const intervalId = setInterval(
            fetchData,
            widget.apiConfig.refreshInterval * 1000
        );

        return () => clearInterval(intervalId);
    }, [widget.apiConfig.url, widget.apiConfig.refreshInterval]);

    /* ---------- ICON BY TYPE ---------- */
    const TypeIcon =
        widget.type === "card"
            ? ViewCarouselIcon
            : widget.type === "table"
            ? TocIcon
            : BarChartIcon;

    /* ---------- CARD VALUE ---------- */
    const getCardValue = () => {
        if (!data || typeof data !== "object") return null;

        for (const key of Object.keys(data)) {
            const value = data[key];
            if (typeof value === "number") return value;

            if (typeof value === "object") {
                for (const innerKey of Object.keys(value)) {
                    if (typeof value[innerKey] === "number") {
                        return value[innerKey];
                    }
                }
            }
        }
        return null;
    };

    /* ---------- TABLE ---------- */
    const getTableRows = () => {
        if (!data || typeof data !== "object") return [];

        const rows: { key: string; value: any }[] = [];

        const traverse = (obj: any, parentKey = "") => {
            for (const key in obj) {
                const value = obj[key];
                const fullKey = parentKey ? `${parentKey}.${key}` : key;

                if (typeof value === "object" && value !== null) {
                    traverse(value, fullKey);
                } else {
                    rows.push({ key: fullKey, value });
                }
            }
        };

        traverse(data);
        return rows;
    };

    /* ---------- CHART ---------- */
    const getChartData = () => {
        if (!data?.prices) return [];

        return data.prices.map((item: [number, number]) => ({
            time: new Date(item[0]).toLocaleDateString(),
            value: item[1],
        }));
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
            {/* HEADER BAR */}
            <div className="flex items-center justify-between mb-3">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <TypeIcon className="text-blue-600" />

                    <span className="font-medium text-gray-900 dark:text-white">
                        {widget.title}
                    </span>

                    {/* Refresh interval badge */}
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {widget.apiConfig.refreshInterval}
                        <LoopIcon sx={{ fontSize: 14 }} />
                    </span>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-3">
                    {/* Manual refresh */}
                    <button
                        onClick={fetchData}
                        className="text-gray-500 hover:text-blue-600"
                        title="Refresh"
                    >
                        <LoopIcon />
                    </button>

                    {/* Settings (future use) */}
                    <button
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Settings"
                    >
                        <SettingsIcon />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => removeWidget(widget.id)}
                        className="text-gray-500 hover:text-red-600"
                        title="Delete"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div>
                {loading && <p className="text-sm text-gray-500">Loading…</p>}
                {error && <p className="text-sm text-red-500">Error: {error}</p>}

                {/* CARD */}
                {!loading && !error && widget.type === "card" && (
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {getCardValue() ?? "—"}
                    </div>
                )}

                {/* TABLE */}
                {!loading && !error && widget.type === "table" && (
                    <table className="w-full border mt-2 text-sm">
                        <tbody>
                            {getTableRows().map((row, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{row.key}</td>
                                    <td className="border p-2">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* CHART */}
                {!loading && !error && widget.type === "chart" && (
                    <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <LineChart data={getChartData()}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {/* last updated */}
                
    {lastUpdated && (
    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated{" "}
            <span className="font-medium">
                {lastUpdated.toLocaleTimeString()}
            </span>
        </p>
    </div>
)}


            </div>
        </div>
    );
}
