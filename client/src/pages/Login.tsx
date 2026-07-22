import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { colors, tint } from "../components/DashboardUI";
import Icon from "../components/Icon";
import type { IconName } from "../components/Icon";
import {
  authPage,
  authCard,
  authInput,
  authLabel,
  authPrimaryBtn,
  authError,
  authLink,
  authMuted,
} from "./authStyles";

// Maps the /login/:role portal to the role the account must actually have.
const PORTALS: Record<
  string,
  { label: string; role: string; path: string; icon: IconName; tone: string }
> = {
  admin: { label: "Admin", role: "ADMIN", path: "/admin", icon: "shield", tone: "#7c3aed" },
  user: { label: "User", role: "CUSTOMER", path: "/user", icon: "user", tone: "#2563EB" },
  driver: { label: "Driver", role: "DRIVER", path: "/driver", icon: "driver", tone: "#059669" },
};

export default function Login() {
  const navigate = useNavigate();
  const { role } = useParams();
  const portal = role ? PORTALS[role] : undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Unknown role in the URL -> back to the selection screen.
  if (!portal) {
    navigate("/", { replace: true });
    return null;
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data;

      // Enforce that the account matches the chosen portal.
      if (user.role !== portal.role) {
        setError(
          `This is the ${portal.label} portal, but this account is a ${user.role} account. Please use the correct portal.`
        );
        setLoading(false);
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(user));
      navigate(portal.path);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (typeof err?.response?.data === "string"
            ? err.response.data
            : "Login failed")
      );
      setLoading(false);
    }
  };

  return (
    <div style={authPage}>
      <div style={authCard}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 19,
              background: tint(portal.tone, 0.12),
              color: portal.tone,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <Icon name={portal.icon} size={29} />
          </div>
          <div
            style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}
          >
            {portal.label} Login
          </div>
          <div style={{ ...authMuted, marginTop: 4 }}>
            Sign in to your SmartTrip {portal.label.toLowerCase()} account
          </div>
        </div>

        {error && <div style={authError}>{error}</div>}

        <form onSubmit={login}>
          <label style={authLabel}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={authInput}
          />

          <label style={authLabel}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={authInput}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ ...authPrimaryBtn, opacity: loading ? 0.6 : 1, marginTop: 6 }}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        {role === "user" && (
          <div style={{ textAlign: "center", marginTop: 18, ...authMuted }}>
            New here?{" "}
            <Link to="/register" style={authLink}>
              Create an account
            </Link>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link to="/" style={{ ...authLink, color: colors.muted }}>
            ← Back to portal selection
          </Link>
        </div>
      </div>
    </div>
  );
}
