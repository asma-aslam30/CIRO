"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE, setToken } from "@/lib/auth";

/* ── SVG sub-components ── */
function HexagonIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 2 L93 27 L93 73 L50 98 L7 73 L7 27 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(0,240,255,0.06)"
      />
      <path
        d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        fill="none"
      />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        C
      </text>
    </svg>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${8 + i * 11}%`,
            top: `${15 + (i % 4) * 22}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Component ── */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Minimum 6 characters required";
    }

    if (!confirmPassword) {
      errors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function FieldError({ field }) {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1.5 text-[11px] font-mono text-nexus-red flex items-center gap-1.5"
         style={{ textShadow: "0 0 8px rgba(255,0,60,0.3)" }}>
        <span className="inline-block w-1 h-1 rounded-full bg-nexus-red" />
        {fieldErrors[field]}
      </p>
    );
  }

  return (
    <div className="gradient-mesh scan-lines scan-beam min-h-screen flex items-center justify-center relative overflow-hidden">
      <Particles />

      {/* Hex grid overlay */}
      <div className="hex-grid fixed inset-0 pointer-events-none z-0" />

      {/* Radial bloom */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px] bg-nexus-purple pointer-events-none"
        style={{ top: "35%", left: "50%", transform: "translate(-50%,-50%)" }}
      />

      {/* ═══ Register Card ═══ */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="glass-card rounded-2xl p-8 sm:p-10 animate-pulse-glow">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-nexus-purple/40 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-nexus-purple/40 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-nexus-purple/40 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-nexus-purple/40 rounded-br-2xl" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8 animate-fade-in-up">
            <HexagonIcon className="w-16 h-16 text-nexus-purple animate-float mb-4" />
            <h1 className="text-2xl font-extrabold tracking-[0.2em] neon-text-purple animate-flicker">
              CIRO NEXUS
            </h1>
            <p className="mt-2 text-[11px] tracking-[0.35em] text-nexus-text-dim font-mono uppercase">
              Initialize New Account
            </p>
          </div>

          {/* Server Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-nexus-red/10 border border-nexus-red/30 text-nexus-red text-sm text-center animate-fade-in-up"
                 style={{ textShadow: "0 0 12px rgba(255,0,60,0.4)" }}>
              <span className="font-mono text-xs mr-2 opacity-60">[ERR]</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="animate-fade-in-up delay-200">
              <label className="block text-[11px] font-mono tracking-[0.25em] text-nexus-text-dim uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                placeholder="operator@ciro.nexus"
                className={`cyber-input w-full px-4 py-3 text-sm ${fieldErrors.email ? "!border-nexus-red/50" : ""}`}
              />
              <FieldError field="email" />
            </div>

            {/* Password */}
            <div className="animate-fade-in-up delay-300">
              <label className="block text-[11px] font-mono tracking-[0.25em] text-nexus-text-dim uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
                  placeholder="••••••••••••"
                  className={`cyber-input w-full px-4 py-3 pr-12 text-sm ${fieldErrors.password ? "!border-nexus-red/50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-text-dim hover:text-nexus-purple transition-colors text-xs font-mono"
                  tabIndex={-1}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              <FieldError field="password" />
            </div>

            {/* Confirm Password */}
            <div className="animate-fade-in-up delay-400">
              <label className="block text-[11px] font-mono tracking-[0.25em] text-nexus-text-dim uppercase mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirm: "" })); }}
                placeholder="••••••••••••"
                className={`cyber-input w-full px-4 py-3 text-sm ${fieldErrors.confirm ? "!border-nexus-red/50" : ""}`}
              />
              <FieldError field="confirm" />
            </div>

            {/* Submit */}
            <div className="animate-fade-in-up delay-500 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 text-sm tracking-[0.15em] uppercase rounded-lg font-bold
                  flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer
                  transition-all duration-300
                  ${loading
                    ? "opacity-70 cursor-not-allowed bg-nexus-purple/30 text-nexus-purple border border-nexus-purple/20"
                    : "bg-gradient-to-r from-nexus-purple to-nexus-cyan text-nexus-bg hover:shadow-[0_0_25px_rgba(168,85,247,0.35),0_0_50px_rgba(0,240,255,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                  }
                `}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-nexus-purple border-t-transparent rounded-full animate-spin" />
                    INITIALIZING…
                  </>
                ) : (
                  "CREATE ACCOUNT"
                )}
                {/* shimmer sweep */}
                {!loading && (
                  <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-nexus-purple/20 to-transparent" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-nexus-text-dim">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-nexus-purple/20 to-transparent" />
          </div>

          {/* Login link */}
          <div className="text-center animate-fade-in-up delay-700">
            <p className="text-sm text-nexus-text-dim">
              Already have access?{" "}
              <Link
                href="/login"
                className="text-nexus-purple hover:underline underline-offset-4 transition-colors neon-text-subtle font-semibold"
              >
                LOGIN
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-nexus-text-dim/50 tracking-widest animate-fade-in-up delay-1000">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse" />
          NEXUS SYSTEM ONLINE — v2.0
        </div>
      </div>
    </div>
  );
}
