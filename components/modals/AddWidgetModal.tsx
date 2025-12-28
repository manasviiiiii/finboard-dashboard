"use client";

import BarChartIcon from "@mui/icons-material/BarChart";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import TocIcon from "@mui/icons-material/Toc";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { useWidgetStore } from "@/store/useWidgetStore";

interface Props {
    onClose: () => void;
}

export default function AddWidgetModal({ onClose }: Props) {
    const addWidget = useWidgetStore((state) => state.addWidget);

    const [title, setTitle] = useState("");
    const [type, setType] = useState<"card" | "table" | "chart">("card");
    const [url, setUrl] = useState("");
    const [refresh, setRefresh] = useState(10);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<"success" | "error" | null>(
        null
    );

    const testApi = async () => {
        if (!url) return;
        try {
            setTesting(true);
            setTestResult(null);
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            await res.json();
            setTestResult("success");
        } catch {
            setTestResult("error");
        } finally {
            setTesting(false);
        }
    };

    const handleAdd = () => {
        if (!title || !url) return;

        addWidget({
            id: Date.now().toString(),
            title,
            type,
            apiConfig: {
                url,
                refreshInterval: refresh,
            },
        });

        onClose();
    };

    const iconBase =
        "flex flex-col items-center justify-center gap-1 p-3 rounded-lg cursor-pointer border transition-all";

    const active =
        "bg-blue-600 text-white border-blue-500 shadow-lg";

    const inactive =
        "bg-slate-800 text-white border-slate-700 hover:bg-slate-700";

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl w-96 shadow-2xl border border-slate-700 text-white">
                <h3 className="text-lg font-semibold mb-5 text-blue-400">
                    Add Widget
                </h3>

                {/* Widget Name */}
                <label className="text-sm font-medium mb-1 block">
                    Widget Name
                </label>
                <input
                    className="bg-slate-800 border border-slate-700 text-white
                               p-2 w-full mb-4 rounded
                               focus:ring-2 focus:ring-blue-500 focus:outline-none
                               placeholder:text-slate-400"
                    placeholder="eg. BTC Price"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Display Type */}
                <h4 className="text-sm font-medium mb-2">Display</h4>
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div
                        onClick={() => setType("card")}
                        className={`${iconBase} ${
                            type === "card" ? active : inactive
                        }`}
                    >
                        <ViewCarouselIcon />
                        <span className="text-xs">Card</span>
                    </div>

                    <div
                        onClick={() => setType("table")}
                        className={`${iconBase} ${
                            type === "table" ? active : inactive
                        }`}
                    >
                        <TocIcon />
                        <span className="text-xs">Table</span>
                    </div>

                    <div
                        onClick={() => setType("chart")}
                        className={`${iconBase} ${
                            type === "chart" ? active : inactive
                        }`}
                    >
                        <BarChartIcon />
                        <span className="text-xs">Chart</span>
                    </div>
                </div>

                {/* API URL */}
                <label className="text-sm font-medium mb-1 block">
                    API URL
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        className="bg-slate-800 border border-slate-700 text-white
                                   p-2 flex-1 rounded
                                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   placeholder:text-slate-400"
                        placeholder="https://api.example.com/data"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        onClick={testApi}
                        disabled={testing}
                        className="flex items-center gap-1 px-3 rounded
                                   bg-slate-800 border border-slate-700
                                   hover:bg-slate-700 text-blue-400"
                    >
                        Test <CachedIcon fontSize="small" />
                    </button>
                </div>

                {testResult && (
                    <p
                        className={`text-xs mb-4 ${
                            testResult === "success"
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        {testResult === "success"
                            ? "API reachable and valid JSON"
                            : "API test failed"}
                    </p>
                )}

                {/* Refresh Interval */}
                <label className="text-sm font-medium mb-1 block">
                    Refresh interval (seconds)
                </label>
                <input
                    type="number"
                    min={1}
                    className="bg-slate-800 border border-slate-700 text-white
                               p-2 w-full mb-5 rounded
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={refresh}
                    onChange={(e) => setRefresh(Number(e.target.value))}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded text-gray-300 hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700
                                   text-white px-4 py-1 rounded shadow"
                    >
                        Add Widget
                    </button>
                </div>
            </div>
        </div>
    );
}
