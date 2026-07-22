type Point = { label: string; value: number };

export default function BarChart({
    data,
    color = "#4f46e5",
}: {
    data: Point[];
    color?: string;
}) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                height: 220,
                padding: "20px 10px 0",
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                overflowX: "auto",
            }}
        >
            {data.map((d) => {
                const heightPct = (d.value / max) * 100;
                return (
                    <div
                        key={d.label}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            flex: 1,
                            minWidth: 40,
                            height: "100%",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: "#475569",
                                marginBottom: 4,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {d.value > 0 ? d.value : ""}
                        </div>
                        <div
                            title={`${d.label}: ₹${d.value}`}
                            style={{
                                width: "70%",
                                height: `${heightPct}%`,
                                minHeight: d.value > 0 ? 4 : 0,
                                background: color,
                                borderRadius: "6px 6px 0 0",
                                transition: "height 0.3s",
                            }}
                        />
                        <div
                            style={{
                                fontSize: 12,
                                color: "#64748b",
                                marginTop: 6,
                            }}
                        >
                            {d.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
