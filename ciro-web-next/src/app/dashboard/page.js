'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getToken, removeToken, fetchWithAuth, API_BASE } from '@/lib/auth'
import styles from './dashboard.module.css'

// Dynamically import map (no SSR)
const NexusMap = dynamic(() => import('@/components/NexusMap'), { ssr: false })

// SVG Icons as components
const HexIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
)
const RadioIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const ScanIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
)
const TerminalIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
)
const CpuIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
)
const NetworkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>
  </svg>
)
const ShieldIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
)
const ShieldAlertIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const ActivityIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const ListIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const RotateIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
)

const WS_URL = 'ws://localhost:8000/ws'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  // App state
  const [signalsCount, setSignalsCount] = useState(0)
  const [crisis, setCrisis] = useState(null)
  const [actions, setActions] = useState([])
  const [logs, setLogs] = useState([])
  const [isOnline, setIsOnline] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [neuralLoad, setNeuralLoad] = useState(45)
  const [signalText, setSignalText] = useState('')
  const [signalLocation, setSignalLocation] = useState('F-6 Markaz')
  const [isSending, setIsSending] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Chart data
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0])
  const chartCanvasRef = useRef(null)
  const wsRef = useRef(null)

  // Ref for logs to avoid stale closures
  const logsRef = useRef(logs)
  logsRef.current = logs

  const addAudit = useCallback((tag, text) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setLogs(prev => {
      const next = [{ time, tag, text }, ...prev]
      return next.slice(0, 50)
    })
  }, [])

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res = await fetchWithAuth(`${API_BASE}/auth/me`)
        if (!res.ok) {
          removeToken()
          router.push('/login')
          return
        }
        const data = await res.json()
        setUserEmail(data.email)
        setIsLoading(false)
      } catch {
        removeToken()
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Neural load randomizer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!crisis) {
        setNeuralLoad(Math.floor(Math.random() * 20) + 30)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [crisis])

  // WebSocket
  useEffect(() => {
    if (isLoading) return

    let reconnectTimeout

    const connect = () => {
      const socket = new WebSocket(WS_URL)
      wsRef.current = socket

      socket.onopen = () => {
        setIsOnline(true)
        addAudit('KERNEL', 'Nexus uplink established. Awaiting telemetry.')
      }

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        switch (msg.type) {
          case 'SIGNAL_RECEIVED':
            setSignalsCount(msg.count)
            addAudit('DATA_STREAM', `Encrypted packet from ${msg.last_location} decrypted.`)
            setChartData(prev => {
              const next = [...prev.slice(1), Math.floor(Math.random() * 8) + 8]
              return next
            })
            break
          case 'CRISIS_DETECTED':
            setCrisis(msg.data)
            addAudit('AI_CORE', `THREAT DETECTED: ${msg.data.crisis_type}`)
            setNeuralLoad(99)
            setChartData([5, 12, 8, 19, 15, 20, 18])
            break
          case 'ACTION_EXECUTED':
            setActions(prev => [...prev, msg.data])
            addAudit('EXECUTION', `${msg.data.action} protocol initiated.`)
            break
          case 'SYSTEM_RESET':
            setCrisis(null)
            setActions([])
            setSignalsCount(0)
            setChartData([0, 0, 0, 0, 0, 0, 0])
            addAudit('SYS', 'Memory buffers flushed. State nominal.')
            break
        }
      }

      socket.onclose = () => {
        setIsOnline(false)
        addAudit('SYS_ERR', 'Nexus uplink lost. Reconnecting...')
        reconnectTimeout = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [isLoading, addAudit])

  // Draw chart
  useEffect(() => {
    const canvas = chartCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const dw = canvas.offsetWidth
    const dh = canvas.offsetHeight

    ctx.clearRect(0, 0, dw, dh)

    const color = crisis ? '#ff003c' : '#00f0ff'
    const maxVal = 20
    const points = chartData.map((v, i) => ({
      x: (i / (chartData.length - 1)) * dw,
      y: dh - (v / maxVal) * dh * 0.85 - 5
    }))

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, dh)
    gradient.addColorStop(0, crisis ? 'rgba(255, 0, 60, 0.4)' : 'rgba(0, 240, 255, 0.4)')
    gradient.addColorStop(1, 'transparent')

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2
      const yc = (points[i].y + points[i - 1].y) / 2
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
    }
    ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y)
    ctx.lineTo(dw, dh)
    ctx.lineTo(0, dh)
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2
      const yc = (points[i].y + points[i - 1].y) / 2
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [chartData, crisis])

  // API calls
  const sendSignal = async () => {
    if (!signalText.trim()) return
    setIsSending(true)
    try {
      await fetch(`${API_BASE}/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ source: 'CONSOLE', text: signalText, location: signalLocation }])
      })
      setSignalText('')
    } finally {
      setIsSending(false)
    }
  }

  const triggerAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      await fetch(`${API_BASE}/analyze`, { method: 'POST' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetSystem = async () => {
    await fetch(`${API_BASE}/reset`, { method: 'POST' })
  }

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <HexIcon className={styles.loadingLogo} />
        <span className={styles.loadingText}>AUTHENTICATING...</span>
      </div>
    )
  }

  return (
    <div className={`${styles.dashboard} ${crisis ? styles.threatActive : ''}`}>
      {/* ═══ Header ═══ */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <HexIcon className={styles.logo} />
          <h1 className={styles.title}>
            CIRO <span className={styles.titleAccent}>NEXUS</span>
          </h1>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.reticle}>SYS.CORE.v2</div>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.clock}>{currentTime}</span>
          <div className={`${styles.statusBadge} ${!isOnline ? styles.alert : ''}`}>
            <span className={`${styles.statusDot} ${!isOnline ? styles.offline : ''}`} />
            <span className={styles.statusText}>
              {isOnline ? 'SYSTEM_ONLINE' : 'LINK_OFFLINE'}
            </span>
          </div>
          <div className={styles.userInfo}>
            {userEmail}
            <button className={styles.logoutBtn} onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>
      </header>

      {/* ═══ Main Body ═══ */}
      <div className={styles.body}>
        {/* ── Left Panel ── */}
        <aside className={`${styles.panel} ${styles.leftPanel}`}>
          {/* Command Injection */}
          <div>
            <div className={styles.panelHeader}>
              <TerminalIcon className={styles.panelIcon} />
              <h2 className={styles.panelTitle}>COMMAND_INJECTION</h2>
            </div>
            <select
              className={styles.cyberSelect}
              value={signalLocation}
              onChange={e => setSignalLocation(e.target.value)}
            >
              <option value="F-6 Markaz">SEC-01: F-6 MARKAZ</option>
              <option value="Blue Area">SEC-02: BLUE AREA</option>
              <option value="Saddar">SEC-03: SADDAR</option>
            </select>
            <textarea
              className={styles.cyberTextarea}
              placeholder="> Input raw telemetry sequence..."
              value={signalText}
              onChange={e => setSignalText(e.target.value)}
            />
            <button className={styles.btnCyber} onClick={sendSignal} disabled={isSending}>
              <RadioIcon className={styles.btnIcon} />
              {isSending ? 'ENCRYPTING...' : 'BROADCAST_SIGNAL'}
            </button>
          </div>

          {/* Kernel Actions */}
          <div className={styles.sectionDivider}>
            <div className={styles.panelHeader}>
              <CpuIcon className={styles.panelIcon} />
              <h2 className={styles.panelTitle}>KERNEL_ACTIONS</h2>
            </div>
            <div className={styles.btnGroup}>
              <button
                className={styles.btnPrimary}
                onClick={triggerAnalysis}
                disabled={signalsCount === 0 || crisis !== null || isAnalyzing}
              >
                <ScanIcon className={styles.btnIcon} />
                {isAnalyzing ? 'PROCESSING...' : 'RUN_ANALYSIS'}
              </button>
              <button className={styles.btnGhost} onClick={resetSystem}>
                <RotateIcon className={styles.btnIcon} />
                RESET
              </button>
            </div>
          </div>

          {/* Swarm Cognition */}
          <div className={styles.sectionDivider}>
            <div className={styles.panelHeader}>
              <NetworkIcon className={styles.panelIcon} />
              <h2 className={styles.panelTitle}>SWARM_COGNITION</h2>
            </div>
            <div className={styles.streamRow}>
              <span className={styles.streamLabel}>DATA_THROUGHPUT</span>
              <span className={styles.streamValue}>98%</span>
            </div>
            <div className={styles.healthBar}>
              <div className={styles.healthFill} style={{ width: '98%' }} />
            </div>
            <div className={styles.streamRow}>
              <span className={styles.streamLabel}>NEURAL_LOAD</span>
              <span className={styles.streamValue} style={crisis ? { color: '#ff003c' } : {}}>
                {neuralLoad}%
              </span>
            </div>
            <div className={styles.healthBar}>
              <div
                className={styles.healthFill}
                style={{
                  width: `${neuralLoad}%`,
                  ...(crisis ? { background: '#ff003c', boxShadow: '0 0 8px #ff003c' } : {})
                }}
              />
            </div>
          </div>
        </aside>

        {/* ── Map Center ── */}
        <div className={styles.mapArea}>
          <div className={styles.mapContainer}>
            <NexusMap crisisLocation={crisis?.location} />
          </div>
          <div className={styles.mapGridOverlay} />
          <div className={styles.radarScan} />
          <div className={styles.vignetteOverlay} />
        </div>

        {/* ── Right Panel ── */}
        <aside className={`${styles.panel} ${styles.rightPanel}`}>
          {/* Threat Intelligence */}
          <div>
            <div className={styles.panelHeader}>
              <ShieldAlertIcon className={styles.panelIcon} />
              <h2 className={styles.panelTitle}>THREAT_INTELLIGENCE</h2>
            </div>
            {crisis ? (
              <div className={styles.intelCard}>
                <span className={styles.sevTag}>{crisis.severity || 'CRITICAL'}</span>
                <h4 className={styles.intelType}>{crisis.crisis_type}</h4>
                <div className={styles.intelMeta}>
                  <span>LOC: {crisis.location}</span>
                  <span>CONFIDENCE: {crisis.confidence || 95}%</span>
                </div>
                <p className={styles.intelReason}>&gt; {crisis.reasoning}</p>
              </div>
            ) : (
              <div className={styles.hudEmpty}>
                <ShieldIcon className={styles.hudEmptyIcon} />
                <p className={styles.hudEmptyText}>NO_ACTIVE_THREATS</p>
                <div className={styles.scanLineSmall} />
              </div>
            )}
          </div>

          {/* System Pulse */}
          <div className={styles.sectionDivider}>
            <div className={styles.panelHeader}>
              <ActivityIcon className={styles.panelIcon} />
              <h2 className={styles.panelTitle}>SYSTEM_PULSE</h2>
            </div>
            <div className={styles.chartContainer}>
              <canvas ref={chartCanvasRef} className={styles.chartCanvas} />
            </div>
          </div>
        </aside>
      </div>

      {/* ═══ Footer Log Panel ═══ */}
      <footer className={styles.footer}>
        <div className={styles.logColumn}>
          <div className={styles.panelHeader}>
            <ListIcon className={styles.panelIcon} />
            <h2 className={styles.panelTitle}>RESPONSE_CHAIN</h2>
          </div>
          <div className={styles.logContent}>
            {actions.length === 0 ? (
              <div className={styles.logEmpty}>Awaiting directives...</div>
            ) : (
              [...actions].reverse().map((a, i) => (
                <div key={i} className={styles.logLine}>
                  <span className={styles.logTime}>{a.time}</span>
                  <span className={styles.logValue}>{a.action}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.logColumn}>
          <div className={styles.panelHeader}>
            <TerminalIcon className={styles.panelIcon} />
            <h2 className={styles.panelTitle}>KERNEL_AUDIT</h2>
          </div>
          <div className={styles.logContent}>
            {logs.map((l, i) => (
              <div key={i} className={styles.logLine}>
                <span className={styles.logTime}>{l.time}</span>
                <span className={styles.logTag}>[{l.tag}]</span>
                <span className={styles.logText}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
