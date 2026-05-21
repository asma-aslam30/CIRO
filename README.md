# CIRO Nexus (Centralized Incident Response & Orchestration)

CIRO Nexus is an advanced, AI-driven "War Room" platform designed to aggregate, analyze, and orchestrate emergency responses to urban crises in real-time. By utilizing a multi-agent AI pipeline (Swarm Cognition), the system ingests telemetry data from various sources (social media, weather APIs, traffic sensors, health departments, etc.), detects critical patterns, and autonomously generates actionable response plans.

## 🚀 Core Features

- **Multi-Agent Swarm Intelligence**: Uses specialized AI agents (Signal, Detection, Reasoning, Planning, Simulation, Visualization) powered by Google Gemini to process and respond to crises.
- **Real-Time Cross-Platform Synchronization**: Full duplex WebSocket integration ensures the Next.js Web Dashboard and React Native Mobile App are perfectly synced in real-time.
- **Autopilot Simulation Mode**: Built-in mock data engine that continuously injects randomized, realistic telemetry (e.g., Structural Fires, Urban Flooding, Traffic Collisions) every few seconds to simulate a live command center.
- **Tactical Mapping**: Interactive maps with animated pulse markers plotting active incidents across different city zones simultaneously.
- **Threat Intelligence History**: Persistent logging of all detected incidents and system actions, preserving response chains.
- **Secure Authentication**: JWT-based login and signup portals to protect sensitive dashboard access.

## 💻 Technology Stack

### Backend (`ciro-backend`)
- **Language**: Python 3
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **AI Integration**: Google Gemini API (`google-generativeai`)
- **Real-time**: WebSockets (`fastapi.websockets`)

### Web Dashboard (`ciro-web-next`)
- **Framework**: Next.js (App Router)
- **UI Library**: React
- **Styling**: Vanilla CSS Modules (Cyberpunk/Glassmorphism theme)
- **Mapping**: Leaflet (`react-leaflet`)

### Mobile Application (`ciro-mobile`)
- **Framework**: React Native (Expo)
- **Styling**: Custom Stylesheets, `expo-linear-gradient`
- **Icons**: `lucide-react-native`
- **Animations**: `react-native-reanimated`

---
*Built as a cutting-edge command center simulation demonstrating the power of Agentic AI in urban management.*
