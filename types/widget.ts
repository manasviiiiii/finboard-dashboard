export interface Widget {
    id: string;
    title: string;
    type: "card" | "table" | "chart";
    apiConfig: {
        url: string;
        refreshInterval: number;
    };
}
