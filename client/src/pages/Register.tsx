import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { colors, tint } from "../components/DashboardUI";
import Icon from "../components/Icon";
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

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email and password are required");
      return;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // Registration returns a token (same shape as login) -> auto sign-in.
      sessionStorage.setItem("user", JSON.stringify(res.data));
      navigate("/user");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
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
              background: tint(colors.accent, 0.12),
              color: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <Icon name="user" size={29} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>
            Create your account
          </div>
          <div style={{ ...authMuted, marginTop: 4 }}>
            Sign up as a SmartTrip user to book trips
          </div>
        </div>

        {error && <div style={authError}>{error}</div>}

        <form onSubmit={submit}>
          <label style={authLabel}>Full Name</label>
          <input
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            style={authInput}
          />

          <label style={authLabel}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            style={authInput}
          />

          <label style={authLabel}>Phone Number</label>
          <input
            placeholder="e.g. +7 700 123 4567"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            style={authInput}
          />

          <label style={authLabel}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            style={authInput}
          />

          <label style={authLabel}>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            style={authInput}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ ...authPrimaryBtn, opacity: loading ? 0.6 : 1, marginTop: 6 }}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 18, ...authMuted }}>
          Already have an account?{" "}
          <Link to="/login/user" style={authLink}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
