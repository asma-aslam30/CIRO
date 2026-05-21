# Running CIRO Nexus Locally

This guide provides step-by-step instructions on how to install dependencies and run the CIRO backend, web dashboard, and mobile application simultaneously.

## Prerequisites
- Node.js (v16+ recommended)
- Python (3.9+ recommended)
- A valid Google Gemini API Key.

---

## 1. Backend Setup (`ciro-backend`)

The backend powers the AI swarm logic and maintains the global WebSocket state.

1. **Navigate to the backend directory:**
   ```bash
   cd ciro-backend
   ```
2. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic google-generativeai python-jose[cryptography] passlib[bcrypt] python-multipart
   ```
3. **Set your Environment Variable:**
   Create a `.env` file in the `ciro-backend` folder:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. **Run the server:**
   ```bash
   python main.py
   ```
   *The server will start on `http://127.0.0.1:8000`.*

---

## 2. Web Dashboard Setup (`ciro-web-next`)

The web app is the main command center dashboard.

1. **Navigate to the web directory:**
   ```bash
   cd ciro-web-next
   ```
2. **Install Node dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The Next.js dashboard will be available at `http://localhost:3000`.*

---

## 3. Mobile App Setup (`ciro-mobile`)

The mobile app provides a remote field operator view and manual signal injection interface.

1. **Navigate to the mobile directory:**
   ```bash
   cd ciro-mobile
   ```
2. **Install Node dependencies:**
   ```bash
   npm install
   ```
3. **Run the Expo server:**
   - To run in the web browser (easiest for testing):
     ```bash
     npm run web
     ```
     *This will open the mobile app view at `http://localhost:8081`.*
   - To run on an actual mobile device:
     ```bash
     npx expo start
     ```
     *Then scan the QR code using the Expo Go app on your phone (ensure you are on the same WiFi network).*

---

## 4. Testing the Platform

Once all three environments (Backend, Web Next, Mobile) are running:

1. Open `http://localhost:3000` (Web) and `http://localhost:8081` (Mobile) side by side.
2. Register an account or log in if you already have one.
3. Use the **Autopilot Mode** button on either interface to automatically inject mock data and trigger the AI analysis. Watch both screens sync perfectly via WebSockets.
4. Alternatively, use the `visual_test_demo.py` script in the root folder to run predefined urban crisis scenarios and observe the AI swarm reasoning output.
