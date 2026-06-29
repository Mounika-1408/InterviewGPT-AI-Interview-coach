# Software Requirements Specification (SRS)
## InterviewCoach — AI-Powered Interview Preparation Assistant

**Domain:** Generative AI  
**Platform:** SITER Academy, Norge — Summer Internship 2026  
**Technology Stack:** React + Vite, FastAPI, Azure OpenAI, Azure Speech Service

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for **InterviewCoach**, an AI-powered interview practice web application. The system helps job seekers prepare for technical and behavioral interviews by generating personalised questions from their resume, accepting voice or text answers, and providing instant AI-generated feedback.

### 1.2 Scope
InterviewCoach is a full-stack web application consisting of:
- A **React + Vite** single-page frontend
- A **FastAPI** Python backend
- Integration with **Azure OpenAI** (GPT-4) for question generation and answer evaluation
- Integration with **Azure Speech Service** for real-time voice-to-text transcription

### 1.3 Definitions
| Term | Definition |
|---|---|
| Azure OpenAI | Microsoft's hosted GPT model API |
| Azure Speech | Microsoft's real-time speech recognition service |
| STT | Speech-to-Text |
| SRS | Software Requirements Specification |
| SPA | Single Page Application |

---

## 2. Overall Description

### 2.1 Product Perspective
InterviewCoach addresses a clear gap: most interview preparation tools use static, generic question banks. This system generates questions dynamically from the user's actual resume, making practice directly relevant to their background and target role.

### 2.2 Product Features (Summary)
1. Resume upload (PDF or TXT)
2. AI-generated, resume-tailored interview questions
3. Voice input via Azure Speech SDK
4. Per-answer AI scoring and feedback
5. End-of-session summary report with overall score

### 2.3 User Classes
- **Job Seekers** — the primary users, preparing for interviews
- **Students** — using the tool as part of career preparation

### 2.4 Operating Environment
- Any modern browser (Chrome, Edge, Firefox, Safari)
- Backend: Python 3.10+, Linux/Windows/Mac
- Network access to Azure OpenAI and Azure Speech endpoints

---

## 3. Functional Requirements

### FR-01: Resume Upload
- The system shall accept PDF and TXT resume files up to 10 MB.
- The system shall extract all text content from uploaded PDFs using pdfplumber.
- The system shall reject unsupported file formats with a descriptive error.

### FR-02: Question Generation
- The system shall send the extracted resume text and target job role to Azure OpenAI.
- The system shall generate between 5 and 15 questions (user-configurable).
- Each question shall be categorised as: **technical**, **behavioral**, or **situational**.
- Each question shall have a difficulty level: **easy**, **medium**, or **hard**.
- Questions shall be unique within a session (no duplicates).

### FR-03: Voice Input
- The system shall request microphone access from the browser.
- The system shall fetch a short-lived Azure Speech token from the backend.
- The system shall perform continuous real-time speech recognition using the Azure Speech SDK.
- Transcribed text shall appear live in the answer textarea as the user speaks.
- The user shall be able to stop recording at any time and edit the transcript.

### FR-04: Answer Evaluation
- The system shall evaluate submitted answers against the question and resume context.
- Evaluation shall produce three sub-scores: **Content** (0–100), **Communication** (0–100), **Confidence** (0–100).
- Evaluation shall return: strengths list, improvements list, ideal-answer hint, and overall score.
- Results shall be displayed immediately after submission.

### FR-05: Session Summary
- After all questions are answered, the system shall generate a full session report.
- The report shall include: overall score, top strengths, areas to improve, and a hire/maybe/not-ready recommendation.
- The report shall include a per-question breakdown with individual scores.
- The user shall be able to print the report.

### FR-06: Navigation
- The application shall have four pages: Home, About, Interview, Results.
- All pages shall be accessible via the navigation bar.
- The application shall use client-side routing (React Router).

---

## 4. Non-Functional Requirements

### NFR-01: Responsiveness
- The UI shall be fully responsive across mobile (≥320px), tablet (≥768px), and desktop (≥1024px).
- A mobile-first CSS approach shall be used throughout.

### NFR-02: SEO
- All pages shall include semantic HTML5 elements.
- The `index.html` shall contain: title, meta description, meta keywords, Open Graph tags.
- Heading hierarchy (h1 → h2 → h3) shall be maintained on every page.

### NFR-03: Performance
- The frontend build shall be optimised via Vite (code splitting, tree shaking).
- The Azure Speech SDK shall be dynamically imported to reduce initial bundle size.
- API calls shall have a 60-second timeout to handle slow Azure responses gracefully.

### NFR-04: Security
- Azure credentials shall never be exposed to the frontend.
- Azure Speech tokens (not keys) shall be passed to the frontend — tokens expire after 10 minutes.
- The backend `.env` file shall be excluded from version control via `.gitignore`.

### NFR-05: Accessibility
- Interactive elements shall have visible focus styles.
- The microphone button shall have an `aria-label`.
- `prefers-reduced-motion` media query shall be respected in CSS animations.

### NFR-06: Error Handling
- All API errors shall display a user-friendly toast notification.
- File format errors shall be caught and explained clearly.
- Azure API failures shall be caught server-side and return descriptive HTTP error messages.

---

## 5. System Architecture

```
┌─────────────────────────────────────────┐
│           Browser (React SPA)           │
│  Pages: Home, About, Interview, Results │
│  Components: VoiceInput, FeedbackPanel  │
│  Azure Speech SDK (JS) — client-side    │
└────────────────┬────────────────────────┘
                 │ HTTP (REST API)
                 ▼
┌─────────────────────────────────────────┐
│          FastAPI Backend                │
│  /api/interview/upload-resume           │
│  /api/interview/evaluate                │
│  /api/interview/summary                 │
│  /api/speech/token                      │
└──────────┬──────────────────────────────┘
           │                │
           ▼                ▼
   Azure OpenAI      Azure Speech Service
   (GPT-4 Turbo)     (Token issuer)
```

---

## 6. Data Flow

1. User uploads resume PDF → pdfplumber extracts text → sent to Azure OpenAI
2. Azure OpenAI returns JSON array of questions → displayed one by one
3. User speaks answer → Azure Speech SDK sends audio to Azure → transcript returned live
4. User submits answer → FastAPI sends (question, answer, resume context) to Azure OpenAI → scores + feedback returned
5. All Q&A pairs sent to Azure OpenAI → session summary generated → Results page rendered

---

## 7. Constraints and Assumptions

- Azure OpenAI deployment must be a chat-completion model (GPT-3.5-turbo or GPT-4).
- Azure Speech region must match the Speech resource's actual region.
- The user's browser must support the Web Audio API (for microphone access).
- Resume text extraction quality depends on PDF formatting; scanned PDFs may not extract well.

---

## 8. Future Enhancements

- User accounts and session history (Azure Cosmos DB)
- Company-specific question packs
- Video recording with body language analysis (Azure Video Indexer)
- WhatsApp-based practice mode
- Multi-language interview support
- Integration with LinkedIn to auto-fill job role

---

*Document prepared for SITER Academy Summer Internship 2026 — Generative AI domain.*
