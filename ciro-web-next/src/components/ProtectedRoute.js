'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getToken, removeToken, API_BASE } from '@/lib/auth'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken()

      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 401) {
          removeToken()
          router.push('/login')
          return
        }

        if (!res.ok) {
          throw new Error('Auth verification failed')
        }

        setIsAuthenticated(true)
      } catch (err) {
        console.error('[CIRO] Auth verification error:', err)
        removeToken()
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [router])

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: '#05050f' }}
      >
        {/* Scan line animation */}
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{ zIndex: 1 }}
        >
          <div
            className="absolute left-0 w-full"
            style={{
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
              animation: 'scanLine 3s linear infinite',
            }}
          />
        </div>

        {/* Hexagon SVG with pulse */}
        <div
          className="relative flex items-center justify-center"
          style={{ animation: 'hexPulse 2s ease-in-out infinite' }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: '140px',
              height: '140px',
              background:
                'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)',
              animation: 'glowRing 2s ease-in-out infinite',
            }}
          />

          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hexagon outline */}
            <polygon
              points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
              stroke="url(#hexGradient)"
              strokeWidth="2"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.5))',
              }}
            />
            {/* Inner hexagon */}
            <polygon
              points="50,18 80,35 80,65 50,82 20,65 20,35"
              stroke="rgba(0,255,255,0.3)"
              strokeWidth="1"
              fill="rgba(0,255,255,0.03)"
            />
            {/* CIRO text */}
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fill="url(#textGradient)"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.6))',
              }}
            >
              CIRO
            </text>
            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="hexGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#0088ff" />
                <stop offset="100%" stopColor="#00ffff" />
              </linearGradient>
              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#00ccff" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Authenticating text */}
        <p
          className="mt-8 text-xs font-mono tracking-[0.35em] uppercase"
          style={{
            color: '#00ffff',
            textShadow:
              '0 0 10px rgba(0,255,255,0.6), 0 0 20px rgba(0,255,255,0.3)',
            animation: 'textFlicker 2.5s ease-in-out infinite',
          }}
        >
          Authenticating...
        </p>

        {/* Progress dots */}
        <div className="mt-4 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: '4px',
                height: '4px',
                background: '#00ffff',
                boxShadow: '0 0 6px rgba(0,255,255,0.8)',
                animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Inline keyframes */}
        <style jsx>{`
          @keyframes scanLine {
            0% {
              top: -2px;
            }
            100% {
              top: 100%;
            }
          }
          @keyframes hexPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.85;
            }
          }
          @keyframes glowRing {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          @keyframes textFlicker {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
          @keyframes dotPulse {
            0%,
            80%,
            100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1.3);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
