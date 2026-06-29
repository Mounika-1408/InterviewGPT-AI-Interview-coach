# InterviewCoach — AI-Powered Interview Preparation

An AI-powered interview practice app built with **React + Vite** (frontend) and **FastAPI** (backend), using **Azure OpenAI** for question generation and feedback, and **Azure Speech Service** for voice input.

---

## Project Structure

```
interview-coach/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── config.py                  # Azure credentials via .env
│   ├── .env                       # ← Fill this in
│   ├── requirements.txt
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   ├── routers/
│   │   ├── interview.py           # /api/interview/* endpoints
│   │   └── speech.py              # /api/speech/token endpoint
│   └── services/
│       ├── azure_openai_service.py  # Question gen & evaluation
│       ├── resume_parser.py         # PDF/TXT text extraction
│       └── speech_service.py        # Azure Speech token fetch
│
└── frontend/
    ├── index.html                 # SEO meta tags
    ├── vite.config.js             # Dev proxy → backend
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                # Router setup
        ├── index.css              # Design system / globals
        ├── utils/api.js           # Axios API calls
        ├── hooks/useAzureSpeech.js  # Azure Speech SDK hook
        ├── components/
        │   ├── Navbar.jsx/css
        │   ├── Footer.jsx/css
        │   ├── ResumeUpload.jsx/css  # Drag-and-drop upload
        │   ├── VoiceInput.jsx/css    # Mic + textarea
        │   ├── FeedbackPanel.jsx/css # Score + insights
        │   └── ScoreRing.jsx/css     # SVG score circle
        └── pages/
            ├── Home.jsx/css       # Landing page
            ├── About.jsx/css      # Tech info
            ├── Interview.jsx/css  # Main practice flow
            └── Results.jsx/css    # Session summary report
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- Azure OpenAI resource with a deployed model (e.g., `gpt-4o` or `gpt-35-turbo`)
- Azure Speech Service resource

---

## 1. Configure Azure Credentials

Edit `backend/.env`:

```env
AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=2024-02-01

AZURE_SPEECH_KEY=your_speech_key_here
AZURE_SPEECH_REGION=eastus
```

---

## 2. Run the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
# → Runs at http://localhost:8000
# → API docs at http://localhost:8000/docs
```

---

## 3. Run the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → Runs at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Features

| Feature | Technology |
|---|---|
| Resume upload (PDF/TXT) | pdfplumber + FastAPI |
| Question generation | Azure OpenAI (GPT-4) |
| Voice input | Azure Speech SDK (JS) |
| Answer evaluation | Azure OpenAI with scoring |
| Session summary | Azure OpenAI |
| Responsive UI | React + CSS variables |
| SEO | Semantic HTML + meta tags |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/interview/upload-resume` | Upload PDF, get questions |
| POST | `/api/interview/evaluate` | Evaluate one answer |
| POST | `/api/interview/summary` | Full session summary |
| GET | `/api/speech/token` | Azure Speech token |
| GET | `/health` | Health check |

---

## Deployment (Free Options)

**Frontend:** Deploy to [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
- Build command: `npm run build`
- Publish directory: `dist`
- Set env var: `VITE_API_URL=https://your-backend-url.com`

**Backend:** Deploy to [Render](https://render.com) (free tier)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add all `.env` vars as environment variables in Render dashboard

---

## Submission Checklist (SITER Academy)

- [x] Project registered with unique title
- [x] Complete source code in Git
- [x] FastAPI backend with Azure OpenAI integration
- [x] React frontend with voice input (Azure Speech)
- [x] Responsive design (mobile, tablet, desktop)
- [x] SEO meta tags in `index.html`
- [x] Add-on features: Voice input, AI feedback, score dashboard
- [x] Deployment-ready (Netlify + Render)
- [ ] Push to GitHub and share repository link
- [ ] Deploy and share live URL
- [ ] Prepare documentation PDF
- [ ] Prepare presentation PPT
