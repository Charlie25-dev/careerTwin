# CareerCoach AI — AI-Powered Resume Analyzer & Multilingual Interview Coach

> **A next-generation career preparation platform for college students, fresh graduates, internship applicants, and entry-level job seekers.**

CareerCoach AI empowers candidates to understand their resume's strengths and ATS improvement opportunities, practice realistic personalized mock interviews tailored to their actual projects, and conduct interviews in their native Indian language (**English, हिन्दी, ಕನ್ನಡ, తెలుగు, தமிழ்**).

---

## 🌟 Key Capabilities

### 1. AI-Powered Resume Analyzer
- **Format Support:** Full parsing for **PDF**, **DOCX**, and TXT documents.
- **Entity Extraction:** Automatically extracts Candidate Name, Education, Technical Skills, Projects, Experience, and Certifications.
- **ATS-Style Readiness Gauge:** Actionable observations and potential ATS improvement areas without unrealistic hiring guarantees.
- **Skills Matrix:** Discovers existing competencies and flags in-demand missing skills tailored to target roles.
- **Project & Experience Deep Dive:** Identifies architectural strengths, testing gaps, and metric quantification opportunities.

### 2. Multilingual AI Interview Coach (Unique Differentiator)
- **Supported Languages:**
  - 🇬🇧 **English** (`en-US`)
  - 🇮🇳 **हिन्दी (Hindi)** (`hi-IN`)
  - 🇮🇳 **ಕನ್ನಡ (Kannada)** (`kn-IN`)
  - 🇮🇳 **తెలుగు (Telugu)** (`te-IN`)
  - 🇮🇳 **தமிழ் (Tamil)** (`ta-IN`)
- **End-to-End Localization:** Opening questions, candidate voice/text input, adaptive follow-ups, and final feedback reports are fully generated in the selected language.

### 3. Adaptive Interview Engine
- **Context-Aware Personalization:** Probes into projects extracted from the candidate's resume (e.g., IoT air quality monitoring, MQ135 gas sensor, React/WebSocket editors).
- **Dynamic Difficulty Adaptation:** 
  - *Strong answer:* Prompts deeper inquiries into system bottlenecks, scalability, and design tradeoffs.
  - *Brief answer:* Prompts gentle clarification questions to uncover the candidate's true technical understanding.
- **Conversational Realism:** Questions dynamically follow the candidate's previous response rather than iterating through a static questionnaire.

### 4. Interactive Humanoid AI Avatar
- **Real-Time Visual States:**
  - 🗣️ **Speaking:** Dynamic lip-sync waveforms and radiating sound energy rings with native Web Speech synthesis.
  - 🎧 **Listening:** Audio-reactive microphone waves responsive to candidate voice input.
  - 🧠 **Thinking:** Smooth orbital particle ring indicating live rubric evaluation.
  - 🧘 **Idle:** Soft breathing ambient aura.
- **Dual Answering Modes:** Spoken audio via Web Speech API or manual text keyboard fallback.

### 5. Multi-Metric Performance Feedback Report
- **5-Point Rubric:** Overall Score, Answer Relevance, Technical Depth, Communication Clarity, and Delivery Poise.
- **STAR-Method Coaching:** Demonstrates concrete model answers in the candidate's chosen language with specific improvement recommendations.
- **Suggested Study Topics:** Targeted list of computer science and systems design concepts to review before actual placement drives.

### 6. Security & Privacy-First Architecture
- **Zero Microphone Audio Storage:** Voice input is processed in real time in the browser via Web Speech API and discarded immediately.
- **Data Isolation:** User data and resumes are protected behind JWT authentication and hashed passwords.
- **Right to Permanent Erasure:** Full account and data deletion capability (`/api/auth/delete-account`).

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti |
| **Backend** | Python 3.14 / 3.11+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2 |
| **Database** | SQLite (zero-friction local default) / PostgreSQL ready |
| **AI Layer** | Modular AI service supporting **Google Gemini API** (`gemini-2.5-flash`) & Built-in **Offline Smart Demo AI** |
| **Speech** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) with native regional Indian locales |
| **Avatar** | SVG/Canvas-accelerated responsive humanoid interviewer |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.10+) with `pip`

---

### Step 1: Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`.  
Swagger interactive documentation: `http://127.0.0.1:8000/docs`.

---

### Step 2: Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## ⚡ 1-Click Hackathon / Demo Mode

CareerCoach AI comes with pre-seeded test data for rapid evaluation:
1. Click the **"1-Click Demo"** button on the Navbar or Landing Page to authenticate as **Alex Rivera**.
2. On the Resume Upload page or Dashboard, click **"Use Aarav SWE Resume"** or **"Use Priya IoT Resume"** (features the MQ135 Air Quality Sensor capstone project).
3. Select **"हिन्दी (Hindi)"** or **"English"** in the Language Selection modal.
4. Experience real-time adaptive questioning, speech synthesis, and instant feedback reports!

---

## 🔒 Environment Variables

Copy `.env.example` to `.env` in the `backend/` folder:

```env
AI_API_KEY=               # Optional: Google Gemini API key
AI_PROVIDER=demo          # "demo" for offline smart engine, "gemini" for live LLM
DATABASE_URL=sqlite:///./careercoach.db
SECRET_KEY=careercoach-super-secure-jwt-secret-key-32-chars-long!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MAX_FILE_SIZE_BYTES=5242880
STORAGE_PATH=./uploads
DEMO_MODE=true
```

---

## 🧪 Verification & Automated Testing

To run the comprehensive end-to-end test suite:

```bash
cd backend
python test_e2e.py
```

This verifies:
- Health check & API responsiveness
- Authentication & JWT issuance
- PDF / DOCX resume parsing & structured extraction
- ATS score calculation & gap analysis
- Multilingual interview creation (English & Hindi)
- Candidate answer submission & adaptive follow-up logic
- Multi-metric performance feedback report generation
- Frontend server availability (HTTP 200)

---

## 🌐 Deploying the Application (Friend-Shareable URL)

To host **CareerCoach AI** on cloud infrastructure so friends can access it from any phone or computer without installing Python or Node.js:

```
                  INTERNET (HTTPS)
                         |
                         v
              Vercel / Netlify (Frontend)
                         |  (REST API / HTTPS)
                         v
               Render / Railway (Backend)
                /        |        \
               v         v         v
         SQLite/PgDB   Gemini AI   Web Speech API
```

### 1️⃣ Backend Deployment (Render / Railway / Fly.io)

1. Create a free account on **Render** ([render.com](https://render.com)) or **Railway** ([railway.app](https://railway.app)).
2. Select **Web Service** and connect your project repository.
3. Configure the service parameters:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in the Render Dashboard:
   ```env
   AI_PROVIDER=demo                       # or "gemini"
   AI_API_KEY=                            # Optional: Google Gemini API Key
   DATABASE_URL=sqlite:///./careercoach.db # or PostgreSQL connection string
   SECRET_KEY=careercoach-production-secret-key-change-me!
   ALLOWED_ORIGINS=https://your-frontend-app.vercel.app
   DEMO_MODE=true
   ```
5. Deploy the service and copy your public backend URL (e.g., `https://careercoach-backend.onrender.com`).

---

### 2️⃣ Frontend Deployment (Vercel / Netlify / Render Static)

1. Create a free account on **Vercel** ([vercel.com](https://vercel.com)) or **Netlify** ([netlify.com](https://netlify.com)).
2. Import your repository and choose the `frontend` folder as the root directory.
3. Configure build settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the **Environment Variable**:
   ```env
   VITE_API_URL=https://careercoach-backend.onrender.com
   ```
5. Click **Deploy**. Vercel will give you a shareable HTTPS link (e.g. `https://careercoach-ai.vercel.app`)!

---

### 3️⃣ Security & Voice Permissions in Production

- **HTTPS Requirement:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) requires an **HTTPS** connection in production. Deploying via Vercel/Netlify provides free SSL/HTTPS out of the box.
- **Microphone Access:** When your friends open your public link for the first time, their browser will prompt: *"Allow careercoach-ai.vercel.app to use your microphone?"*. Clicking **Allow** enables real-time audio interaction.

---

## 📄 License
MIT License. Built for students, fresh graduates, and career mentors.

