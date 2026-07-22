import type { ReactNode } from "react";

export default function Modal({
    open,
    title,
    onClose,
    children,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: 26,
                    width: 420,
                    maxWidth: "90%",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18,
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: 22,
                            cursor: "pointer",
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// Shared input style for modal forms
export const modalInput: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
    fontSize: 14,
};

export const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "11px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
};
