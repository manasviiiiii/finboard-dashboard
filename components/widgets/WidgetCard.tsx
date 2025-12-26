"use client";

import { useEffect, useState } from "react";
import { Widget } from "@/types/widget";
import { useWidgetStore } from "@/store/useWidgetStore";

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

    /* ---------- CARD LOGIC ---------- */
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

    /* ---------- TABLE LOGIC ---------- */
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

    /* ---------- CHART LOGIC ---------- */
    const getChartData = () => {
        if (!data?.prices) return [];

        return data.prices.map((item: [number, number]) => ({
            time: new Date(item[0]).toLocaleDateString(),
            value: item[1],
        }));
    };

    return (
        <div
            className="border rounded-md p-4 shadow-sm
                 bg-white dark:bg-gray-900
                 text-gray-900 dark:text-gray-100"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">{widget.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {widget.type}
                    </p>
                </div>

                <button
                    onClick={() => removeWidget(widget.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                >
                    ✕
                </button>
            </div>

            {/* Content */}
            <div className="mt-4">
                {loading && <p className="text-sm">Loading...</p>}
                {error && <p className="text-sm text-red-500">Error: {error}</p>}

                {/* CARD */}
                {!loading && !error && widget.type === "card" && (
                    <div className="text-3xl font-bold">
                        {getCardValue() ?? "—"}
                    </div>
                )}

                {/* TABLE */}
                {!loading && !error && widget.type === "table" && (
                    <table className="w-full border mt-2 text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border p-2 text-left">Key</th>
                                <th className="border p-2 text-left">Value</th>
                            </tr>
                        </thead>
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
                    <div className="mt-4" style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                            <LineChart
                                data={getChartData()}
                                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />

                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        `$${Number(value).toLocaleString()}`
                                    }
                                />

                                <Tooltip
                                    formatter={(value: number) =>
                                        `$${value.toLocaleString()}`
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
