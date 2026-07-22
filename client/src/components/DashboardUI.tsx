import type { ReactNode } from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";

export const colors = {
    bg: "#dbe4ea",
    sidebar: "#f8fafc",
    sidebarBorder: "#d7dde4",
    card: "#ffffff",
    primary: "#07152e",
    text: "#0f172a",
    muted: "#64748b",
    success: "#16a34a",
    danger: "#dc2626",
    accent: "#2563EB",
};

// Soft tint of a brand colour, used for icon tiles and badges.
export const tint = (hex: string, alpha: number) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function Sidebar({
    title,
    items,
    active,
    onSelect,
    onLogout,
    userName,
}: {
    title: string;
    items: { key: string; label: string; icon: IconName }[];
    active: string;
    onSelect: (key: string) => void;
    onLogout: () => void;
    userName: string;
}) {
    return (
        <div
            style={{
                width: 260,
                margin: 24,
                borderRadius: 28,
                background: colors.sidebar,
                border: `1px solid ${colors.sidebarBorder}`,
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 48px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
        >
            <div
                style={{
                    padding: "28px 28px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${colors.accent}, #1e3a8a)`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 6px 14px ${tint(colors.accent, 0.4)}`,
                    }}
                >
                    <Icon name="car" size={22} />
                </div>
                <div
                    style={{
                        fontSize: 23,
                        fontWeight: 700,
                        color: colors.primary,
                        letterSpacing: "-0.3px",
                    }}
                >
                    {title}
                </div>
            </div>

            <div
                style={{
                    padding: "0 28px 24px",
                    color: colors.muted,
                    fontSize: 14,
                }}
            >
                {userName}
            </div>

            <div style={{ flex: 1 }}>
                {items.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => onSelect(item.key)}
                        style={{
                            margin: "8px 16px",
                            borderRadius: 14,
                            padding: "14px 18px",
                            cursor: "pointer",
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            background:
                                active === item.key
                                    ? colors.primary
                                    : "transparent",
                            color:
                                active === item.key
                                    ? "#fff"
                                    : colors.text,
                            fontWeight: 600,
                            transition: "0.2s",
                        }}
                    >
                        <Icon name={item.icon} size={19} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div
                style={{
                    padding: 24,
                    borderTop: "1px solid #e2e8f0",
                }}
            >
                <button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 12,
                        border: "none",
                        background: colors.danger,
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <Icon name="logout" size={17} />
                    Logout
                </button>
            </div>
        </div>
    );
}

export function PageShell({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,
                padding: 24,
            }}
        >
            {/* Shared polish for every dashboard: rows highlight on hover and
                buttons lift slightly, so the tables feel responsive to use. */}
            <style>{`
                tbody tr { transition: background .12s ease; }
                tbody tr:hover { background: #f8fafc; }
                button { transition: filter .15s ease, transform .15s ease; }
                button:not(:disabled):hover { filter: brightness(1.08); }
                button:not(:disabled):active { transform: translateY(1px); }
            `}</style>
            {children}
        </div>
    );
}

export function TopBar({
    title,
    userName,
}: {
    title: string;
    userName: string;
}) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "18px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 28,
                boxShadow: "0 8px 25px rgba(15,23,42,.08)",
            }}
        >
            <div
                style={{
                    color: "#64748b",
                    fontWeight: 500,
                }}
            >
                {today}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        background: "#0f172a",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 18,
                    }}
                >
                    {userName.charAt(0).toUpperCase()}
                </div>

                <div>
                    <div
                        style={{
                            fontWeight: 700,
                            color: "#0f172a",
                        }}
                    >
                        {userName}
                    </div>

                    <div
                        style={{
                            fontSize: 13,
                            color: "#94a3b8",
                        }}
                    >
                        {title}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StatCard({
    label,
    value,
    icon,
    accent,
}: {
    label: string;
    value: ReactNode;
    icon: IconName;
    accent?: string;
}) {
    const tone = accent || colors.accent;

    return (
        <div
            style={{
                flex: 1,
                minWidth: 240,
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            }}
        >
            {/* Tinted tile: carries the card's colour without shouting */}
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: tint(tone, 0.12),
                    color: tone,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                }}
            >
                <Icon name={icon} size={25} />
            </div>

            <div
                style={{
                    color: colors.muted,
                    marginBottom: 8,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: colors.primary,
                }}
            >
                {value}
            </div>
        </div>
    );
}

export const tableStyle: React.CSSProperties = {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

export const thStyle: React.CSSProperties = {
    background: "#f8fafc",
    padding: "16px",
    textAlign: "left",
    fontSize: 14,
    color: "#64748b",
};

export const tdStyle: React.CSSProperties = {
    padding: "16px",
    borderTop: "1px solid #e2e8f0",
};

export const statusBadge = (status: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string }> = {
        PENDING: { bg: "#FEF3C7", color: "#92400E" },
        ASSIGNED: { bg: "#DBEAFE", color: "#1D4ED8" },
        ACCEPTED: { bg: "#DCFCE7", color: "#166534" },
        COMPLETED: { bg: "#DCFCE7", color: "#15803D" },
        REJECTED: { bg: "#FEE2E2", color: "#B91C1C" },
    };

    const c = colors[status] || {
        bg: "#E5E7EB",
        color: "#374151",
    };

    return {
        background: c.bg,
        color: c.color,
        padding: "6px 12px",
        borderRadius: 30,
        fontSize: 13,
        fontWeight: 600,
        display: "inline-block",
    };
};

export const actionButton: React.CSSProperties = {
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    background: "#0f172a",
    color: "#fff",
};