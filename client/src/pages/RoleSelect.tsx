import { useNavigate } from "react-router-dom";
import { colors, tint } from "../components/DashboardUI";
import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import { authPage, authMuted } from "./authStyles";

const roles: {
  key: string;
  label: string;
  icon: IconName;
  tone: string;
  desc: string;
}[] = [
  {
    key: "admin",
    label: "Admin",
    icon: "shield",
    tone: "#7c3aed",
    desc: "Manage trips, drivers & vehicles",
  },
  {
    key: "user",
    label: "User",
    icon: "user",
    tone: "#2563EB",
    desc: "Book and track your trips",
  },
  {
    key: "driver",
    label: "Driver",
    icon: "driver",
    tone: "#059669",
    desc: "View & complete assigned trips",
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div style={authPage}>
      <div style={{ width: "100%", maxWidth: 800, textAlign: "center" }}>
        {/* Logo mark + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 17,
              background: `linear-gradient(135deg, ${colors.accent}, #1e3a8a)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 18px ${tint(colors.accent, 0.4)}`,
            }}
          >
            <Icon name="car" size={28} />
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: colors.primary,
              letterSpacing: "-1px",
            }}
          >
            SmartTrip
          </div>
        </div>

        <div style={{ ...authMuted, fontSize: 17, marginBottom: 40 }}>
          Choose how you want to sign in
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 20,
          }}
        >
          {roles.map((r) => (
            <button
              key={r.key}
              className="role-card"
              onClick={() => navigate(`/login/${r.key}`)}
              style={{
                background: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "34px 24px",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 20,
                  background: tint(r.tone, 0.12),
                  color: r.tone,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Icon name={r.icon} size={30} />
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.primary,
                  marginBottom: 6,
                }}
              >
                {r.label}
              </div>
              <div style={{ ...authMuted }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .role-card { transition: transform .15s ease, box-shadow .15s ease; }
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 34px rgba(15,23,42,0.14) !important;
        }
      `}</style>
    </div>
  );
}
