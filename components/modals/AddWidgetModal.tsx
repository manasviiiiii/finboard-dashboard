"use client";

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

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h3 className="text-lg font-semibold mb-4">Add Widget</h3>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Widget title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    className="border p-2 w-full mb-2"
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value as "card" | "table" | "chart")
                    }
                >
                    <option value="card">Card</option>
                    <option value="table">Table</option>
                    <option value="chart">Chart</option>
                </select>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="API URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <input
                    type="number"
                    className="border p-2 w-full mb-4"
                    value={refresh}
                    onChange={(e) => setRefresh(Number(e.target.value))}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
