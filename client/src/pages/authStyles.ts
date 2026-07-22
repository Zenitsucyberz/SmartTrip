import type { CSSProperties } from "react";
import { colors } from "../components/DashboardUI";

// Shared look-and-feel for the auth screens (role select, login, register)
// so they stay consistent with the dashboard aesthetic.

export const authPage: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.bg,
  padding: 24,
  boxSizing: "border-box",
};

export const authCard: CSSProperties = {
  width: "100%",
  maxWidth: 430,
  background: "#fff",
  borderRadius: 24,
  padding: 36,
  boxShadow: "0 18px 40px rgba(15,23,42,.12)",
  boxSizing: "border-box",
};

export const authInput: CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  marginBottom: 14,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  fontSize: 15,
  boxSizing: "border-box",
  background: "#fff",
  color: "#0f172a",
};

export const authLabel: CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  color: "#374151",
  fontSize: 14,
};

export const authPrimaryBtn: CSSProperties = {
  width: "100%",
  padding: "13px",
  borderRadius: 12,
  border: "none",
  background: colors.accent,
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

export const authError: CSSProperties = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "11px 14px",
  borderRadius: 10,
  fontSize: 14,
  marginBottom: 16,
  border: "1px solid #fecaca",
};

export const authLink: CSSProperties = {
  color: colors.accent,
  textDecoration: "none",
  fontWeight: 600,
  cursor: "pointer",
};

export const authMuted: CSSProperties = {
  color: colors.muted,
  fontSize: 14,
};
