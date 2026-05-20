"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

/* ── Hexagon Logo ── */
function HexagonLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hex */}
      <path
        d="M60 4 L110 30 L110 90 L60 116 L10 90 L10 30 Z"
        stroke="url(#hex-grad)"
        strokeWidth="1.5"
        fill="rgba(0,240,255,0.03)"
      />
      {/* Middle hex */}
      <path
        d="M60 18 L98 38 L98 82 L60 102 L22 82 L22 38 Z"
        stroke="rgba(0,240,255,0.25)"
        strokeWidth="1"
        fill="none"
      />
      {/* Inner hex */}
      <path
        d="M60 32 L86 46 L86 74 L60 88 L34 74 L34 46 Z"
        stroke="rgba(0,240,255,0.15)"
        strokeWidth="0.5"
        fill="rgba(0,240,255,0.02)"
      />
      {/* Center dot */}
      <circle cx="60" cy="60" r="4" fill="rgba(0,240,255,0.8)" />
      <circle cx="60" cy="60" r="8" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5" />
      <defs>
        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Floating Particles ── */
function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${5 + i * 13}%`,
            top: `${10 + (i % 4) * 23}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Decorative Hex Grid ── */
function HexGrid() {
  return (
    <div className="hex-grid fixed inset-0 pointer-events-none z-0 opacity-60" />
  );
}

/* ── Main Landing Page ── */
export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="gradient-mesh scan-lines scan-beam min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Particles />
      <HexGrid />

      {/* Large radial bloom */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-15 blur-[160px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.3) 0%, rgba(168,85,247,0.15) 50%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Secondary bloom */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-nexus-purple pointer-events-none"
        style={{ bottom: "10%", right: "15%" }}
      />

      {/* ═══ Content ═══ */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">

        {/* Logo */}
        <div className="animate-scale-in mb-6">
          <HexagonLogo className="w-28 h-28 sm:w-36 sm:h-36 animate-float-slow" />
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up text-5xl sm:text-7xl font-black tracking-[0.15em] leading-tight">
          <span className="neon-text-cyan animate-text-glow">CIRO</span>
          <span className="text-nexus-text-dim mx-3 text-3xl sm:text-5xl font-light">/</span>
          <span className="bg-gradient-to-r from-nexus-cyan to-nexus-purple bg-clip-text text-transparent">
            NEXUS
          </span>
        </h1>

        {/* Decorative line */}
        <div className="animate-fade-in-up delay-200 my-6 w-64 h-px bg-gradient-to-r from-transparent via-nexus-cyan/40 to-transparent" />

        {/* Tagline */}
        <p className="animate-fade-in-up delay-300 text-xs sm:text-sm font-mono tracking-[0.3em] text-nexus-text-dim uppercase leading-relaxed">
          Enterprise Crisis Intelligence
          <br />
          <span className="text-nexus-cyan/60">&</span> Response Orchestrator
        </p>

        {/* Buttons */}
        <div className="animate-fade-in-up delay-500 flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            href="/login"
            className="group relative px-8 py-3.5 rounded-lg text-sm font-bold tracking-[0.15em] uppercase
                       bg-gradient-to-r from-nexus-cyan to-nexus-purple text-nexus-bg
                       hover:shadow-[0_0_30px_rgba(0,240,255,0.3),0_0_60px_rgba(168,85,247,0.15)]
                       hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-300 overflow-hidden"
          >
            ACCESS NEXUS
            <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
            </span>
          </Link>

          <Link
            href="/register"
            className="px-8 py-3.5 rounded-lg text-sm font-semibold tracking-[0.15em] uppercase
                       border border-nexus-cyan/25 text-nexus-cyan
                       bg-nexus-cyan/5
                       hover:bg-nexus-cyan/10 hover:border-nexus-cyan/50
                       hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]
                       hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-300"
          >
            INITIALIZE ACCOUNT
          </Link>
        </div>

        {/* Bottom decorative elements */}
        <div className="animate-fade-in-up delay-700 mt-16 flex items-center gap-3 text-[10px] font-mono text-nexus-text-dim/40 tracking-[0.3em]">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-green/60 animate-pulse" />
          SYSTEM STATUS: OPERATIONAL
        </div>

        {/* Version info */}
        <div className="animate-fade-in-up delay-1000 mt-3 flex items-center gap-6 text-[9px] font-mono text-nexus-text-dim/25 tracking-widest">
          <span>BUILD 2.0.0</span>
          <span className="w-px h-3 bg-nexus-text-dim/10" />
          <span>NEXUS CORE</span>
          <span className="w-px h-3 bg-nexus-text-dim/10" />
          <span>ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}
