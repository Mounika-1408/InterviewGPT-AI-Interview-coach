import './About.css'

const TECH = [
  { name: 'Azure OpenAI', role: 'Question generation & answer evaluation', color: 'var(--cyan)' },
  { name: 'Azure Speech', role: 'Real-time voice-to-text transcription', color: 'var(--purple)' },
  { name: 'FastAPI', role: 'Backend REST API with Python', color: 'var(--green)' },
  { name: 'React + Vite', role: 'Responsive frontend SPA', color: 'var(--amber)' },
  { name: 'pdfplumber', role: 'Resume PDF text extraction', color: 'var(--cyan)' },
]

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <header className="about-header">
          <p className="section-label">About</p>
          <h1>Built for real interview prep</h1>
          <p className="about-intro">
            InterviewCoach uses Azure's enterprise-grade AI to give you a practice session that adapts to your actual resume and target role — not generic questions from a question bank.
          </p>
        </header>

        <section className="about-section">
          <h2>Why InterviewCoach?</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Personalised, not generic</h3>
              <p>Every question is generated from your resume. If you have experience in React and FastAPI, you'll be asked about React and FastAPI — not some other stack.</p>
            </div>
            <div className="about-card">
              <h3>Voice-first design</h3>
              <p>Real interviews are verbal. Practicing by speaking, not just typing, builds the confidence and fluency that actually matters on the day.</p>
            </div>
            <div className="about-card">
              <h3>Expert-level feedback</h3>
              <p>Feedback is structured around content accuracy, communication clarity, and confidence — the same axes a senior interviewer would use.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-list">
            {TECH.map(t => (
              <div key={t.name} className="tech-item">
                <span className="tech-dot" style={{ background: t.color }} />
                <div>
                  <p className="tech-name">{t.name}</p>
                  <p className="tech-role">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Architecture</h2>
          <div className="arch-diagram">
            <ArchBox label="Browser" sub="React + Vite" color="var(--amber)" />
            <Arrow />
            <ArchBox label="FastAPI" sub="Python Backend" color="var(--green)" />
            <Arrow />
            <ArchBox label="Azure OpenAI" sub="GPT-4 Turbo" color="var(--cyan)" />
          </div>
          <div className="arch-diagram" style={{marginTop: 16}}>
            <ArchBox label="Browser" sub="Microphone" color="var(--amber)" />
            <Arrow />
            <ArchBox label="Azure Speech SDK" sub="JS Client-side" color="var(--purple)" />
            <Arrow />
            <ArchBox label="Azure Speech" sub="STT Service" color="var(--cyan)" />
          </div>
        </section>
      </div>
    </div>
  )
}

function ArchBox({ label, sub, color }) {
  return (
    <div className="arch-box" style={{ borderColor: color }}>
      <p className="arch-label" style={{ color }}>{label}</p>
      <p className="arch-sub">{sub}</p>
    </div>
  )
}
function Arrow() {
  return <div className="arch-arrow">→</div>
}
