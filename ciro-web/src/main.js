import './style.css'

const API_BASE = 'http://localhost:8000/api'
const WS_URL = 'ws://localhost:8000/ws'

// Nexus State
let state = {
  signalsCount: 0,
  crisis: null,
  actions: [],
  logs: [],
  map: null,
  marker: null,
  towers: {},
  chart: null,
  chartData: [0, 0, 0, 0, 0, 0, 0]
}

const el = {
  currentTime: document.getElementById('current-time'),
  backendStatus: document.getElementById('backend-status'),
  statusBadge: document.getElementById('status-badge-container'),
  statusDot: document.getElementById('status-dot'),
  btnAnalyze: document.getElementById('btn-analyze'),
  btnReset: document.getElementById('btn-reset'),
  btnSendSignal: document.getElementById('btn-send-signal'),
  signalLocation: document.getElementById('signal-location'),
  signalText: document.getElementById('signal-text'),
  crisisDisplay: document.getElementById('crisis-display'),
  actionLog: document.getElementById('action-log'),
  systemAudit: document.getElementById('system-audit'),
  neuralLoadVal: document.getElementById('neural-load-val'),
  neuralLoadBar: document.getElementById('neural-load-bar')
}

function init() {
  updateTime()
  setInterval(updateTime, 1000)
  
  initMap()
  initChart()
  setupWebSocket()

  el.btnSendSignal.onclick = sendSignal
  el.btnAnalyze.onclick = triggerAnalysis
  el.btnReset.onclick = resetSystem

  // Randomize neural load for visual flair
  setInterval(() => {
    if(!state.crisis) {
      const load = Math.floor(Math.random() * 20) + 30;
      el.neuralLoadVal.textContent = `${load}%`;
      el.neuralLoadBar.style.width = `${load}%`;
    }
  }, 2000)
}

function initMap() {
  state.map = L.map('main-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([33.6844, 73.0479], 13)

  // Using a starker dark map to match the cyberpunk aesthetic
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(state.map)
}

function initChart() {
  const ctx = document.getElementById('pulse-chart').getContext('2d')
  
  // Create gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');   
  gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['', '', '', '', '', '', ''],
      datasets: [{
        data: state.chartData,
        borderColor: '#00f0ff',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false, min: 0, max: 20 } },
      animation: { duration: 400, easing: 'easeOutQuart' }
    }
  })
}

function setupWebSocket() {
  const socket = new WebSocket(WS_URL)

  socket.onopen = () => {
    el.backendStatus.textContent = 'SYSTEM_ONLINE'
    el.statusDot.className = 'dot green'
    addAudit('KERNEL', 'Nexus uplink established. Awaiting telemetry.')
  }

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    
    switch(msg.type) {
      case 'SIGNAL_RECEIVED':
        state.signalsCount = msg.count
        addAudit('DATA_STREAM', `Encrypted packet from ${msg.last_location} decrypted.`)
        updatePulse()
        break
      case 'CRISIS_DETECTED':
        state.crisis = msg.data
        addAudit('AI_CORE', `THREAT DETECTED: ${msg.data.crisis_type}`)
        updateMapMarker(msg.data.location)
        activateThreatMode()
        break
      case 'ACTION_EXECUTED':
        state.actions.push(msg.data)
        addAudit('EXECUTION', `${msg.data.action} protocol initiated.`)
        break
      case 'SYSTEM_RESET':
        resetLocalState()
        break
    }
    render()
  }

  socket.onclose = () => {
    el.backendStatus.textContent = 'LINK_OFFLINE'
    el.statusDot.className = 'dot red'
    addAudit('SYS_ERR', 'Nexus uplink lost. Reconnecting...')
    setTimeout(setupWebSocket, 3000)
  }
}

function updateMapMarker(location) {
  const coords = {
    'F-6 Markaz': [33.7297, 73.0746],
    'Blue Area': [33.7103, 73.0652],
    'Saddar': [33.5950, 73.0543],
    'Expressway': [33.6844, 73.0479],
    'Citywide': [33.6844, 73.0479]
  }
  const pos = coords[location] || [33.6844, 73.0479]
  if (state.marker) state.marker.remove()
  
  const pulseIcon = L.divIcon({
    className: 'custom-pulse-marker',
    html: `
      <div class="pulse-marker-container">
        <div class="pulse-marker-ring"></div>
        <div class="pulse-marker-core"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })

  state.marker = L.marker(pos, { icon: pulseIcon }).addTo(state.map)
  state.map.flyTo(pos, 14, { duration: 2, easeLinearity: 0.25 })
}

function activateThreatMode() {
  document.body.classList.add('threat-active')
  el.statusBadge.classList.add('alert-mode')
  el.backendStatus.textContent = 'CRITICAL_ALERT'
  el.statusDot.className = 'dot red'
  
  // Spike chart
  state.chartData = [5, 12, 8, 19, 15, 20, 18]
  state.chart.data.datasets[0].borderColor = '#ff003c'
  let gradient = state.chart.ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 0, 60, 0.5)');   
  gradient.addColorStop(1, 'rgba(255, 0, 60, 0)');
  state.chart.data.datasets[0].backgroundColor = gradient
  state.chart.update()

  // Spike load
  el.neuralLoadVal.textContent = `99%`;
  el.neuralLoadVal.style.color = '#ff003c';
  el.neuralLoadBar.style.width = `99%`;
  el.neuralLoadBar.style.background = '#ff003c';
}

function resetLocalState() {
  state.signalsCount = 0
  state.crisis = null
  state.actions = []
  if (state.marker) state.marker.remove()
  state.map.setView([33.6844, 73.0479], 13)
  
  document.body.classList.remove('threat-active')
  el.statusBadge.classList.remove('alert-mode')
  if(el.backendStatus.textContent === 'CRITICAL_ALERT') {
    el.backendStatus.textContent = 'SYSTEM_NOMINAL'
    el.statusDot.className = 'dot green'
  }

  // Reset chart
  state.chartData = [0, 0, 0, 0, 0, 0, 0]
  state.chart.data.datasets[0].borderColor = '#00f0ff'
  let gradient = state.chart.ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');   
  gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
  state.chart.data.datasets[0].backgroundColor = gradient
  state.chart.update()

  // Reset load
  el.neuralLoadVal.style.color = '';
  el.neuralLoadBar.style.background = '';

  addAudit('SYS', 'Memory buffers flushed. State nominal.')
}

function addAudit(tag, text) {
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
  state.logs.unshift({ time, tag, text })
  if (state.logs.length > 50) state.logs.pop()
}

function updatePulse() {
  state.chartData.shift()
  state.chartData.push(Math.floor(Math.random() * 8) + 8)
  state.chart.update()
}

function updateTime() {
  el.currentTime.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false })
}

async function sendSignal() {
  const text = el.signalText.value.trim()
  if (!text) return
  
  const btn = el.btnSendSignal
  const originalHtml = btn.innerHTML
  btn.innerHTML = `<span class="btn-content"><i data-lucide="loader"></i> ENCRYPTING...</span>`
  btn.disabled = true
  if (window.lucide) window.lucide.createIcons()

  try {
    await fetch(`${API_BASE}/signals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ source: 'CONSOLE', text, location: el.signalLocation.value }])
    })
    el.signalText.value = ''
  } finally {
    btn.innerHTML = originalHtml
    btn.disabled = false
    if (window.lucide) window.lucide.createIcons()
  }
}

async function triggerAnalysis() {
  const btn = el.btnAnalyze
  const originalHtml = btn.innerHTML
  btn.innerHTML = `<span class="btn-content"><i data-lucide="cpu"></i> PROCESSING...</span>`
  if (window.lucide) window.lucide.createIcons()

  await fetch(`${API_BASE}/analyze`, { method: 'POST' })
  
  btn.innerHTML = originalHtml
  if (window.lucide) window.lucide.createIcons()
}

async function resetSystem() {
  await fetch(`${API_BASE}/reset`, { method: 'POST' })
}

function render() {
  el.btnAnalyze.disabled = state.signalsCount === 0 || state.crisis !== null

  if (state.crisis) {
    el.crisisDisplay.innerHTML = `
      <div class="intel-v4 critical">
        <span class="sev-tag">${state.crisis.severity || 'CRITICAL'}</span>
        <h4>${state.crisis.crisis_type}</h4>
        <div class="intel-meta">
          <span>LOC: ${state.crisis.location}</span> // <span>CONFIDENCE: ${state.crisis.confidence || 95}%</span>
        </div>
        <p class="intel-reason">> ${state.crisis.reasoning}</p>
      </div>
    `
  } else {
    el.crisisDisplay.innerHTML = `
      <div class="hud-empty">
        <i data-lucide="shield-check"></i>
        <p>NO_ACTIVE_THREATS</p>
        <div class="scan-line-small"></div>
      </div>
    `
  }

  if (state.actions.length === 0) {
    el.actionLog.innerHTML = `<div class="log-empty mono-text">Awaiting directives...</div>`
  } else {
    el.actionLog.innerHTML = state.actions.slice().reverse().map(a => `
      <div class="log-line">
        <span class="t">${a.time}</span> <span class="v">${a.action}</span>
      </div>
    `).join('')
  }

  el.systemAudit.innerHTML = state.logs.map(l => `
    <div class="audit-line">
      <span class="t">${l.time}</span> <span class="g">[${l.tag}]</span> <span class="text">${l.text}</span>
    </div>
  `).join('')

  if (window.lucide) window.lucide.createIcons()
}

init()
