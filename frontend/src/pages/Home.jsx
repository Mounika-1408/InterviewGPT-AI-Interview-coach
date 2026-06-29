import { Link } from 'react-router-dom'
import './Home.css'

const FEATURES = [
  { icon: '📄', title: 'Resume-Aware Questions', desc: 'Upload your PDF resume. Azure OpenAI reads your skills and generates role-specific questions tailored to you.' },
  { icon: '🎙️', title: 'Azure Voice Input', desc: 'Answer questions by speaking. Azure Speech Service transcribes your voice in real time — no typing required.' },
  { icon: '🤖', title: 'Instant AI Feedback', desc: 'Each answer is scored on content, communication, and confidence. You get strengths, improvements, and ideal-answer hints.' },
  { icon: '📊', title: 'Session Summary', desc: 'After finishing, get a full report with overall score, patterns, and a hiring recommendation.' },
]

const STEPS = [
  { num: '01', title: 'Upload Resume', desc: "Drop your PDF resume and enter the job role you're targeting. "},
  { num: '02', title: 'Get Questions', desc: 'Azure OpenAI generates technical, behavioral, and situational questions tailored to your profile.' },
  { num: '03', title: 'Answer by Voice or Text', desc: 'Respond to each question naturally — speak or type your answer.' },
  { num: '04', title: 'Review Feedback', desc: 'See your score, feedback, and ideal-answer guidance for every question.' },
]

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge">Powered by Azure OpenAI + Azure Speech</div>
          <h1 className="hero-title">
            Nail your next interview.<br />
            <span className="hero-accent">Practice with AI.</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume, get tailored questions, speak your answers, and receive instant expert feedback — all powered by Azure.
          </p>
          <div className="hero-actions">
            <Link to="/interview" className="btn btn-primary hero-cta">Start Practicing Free</Link>
            <Link to="/about" className="btn btn-ghost">How it works →</Link>
          </div>
          <div className="hero-stats">
            <Stat value="Azure AI" label="Powered" />
            <Stat value="Voice" label="Input" />
            <Stat value="Instant" label="Feedback" />
            <Stat value="Free" label="To Use" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <SectionLabel>Features</SectionLabel>
          <h2 className="section-title">Everything you need to prepare</h2>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <SectionLabel>Process</SectionLabel>
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div key={s.num} className="step-card">
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Ready to ace your interview?</h2>
          <p>Upload your resume and get started in under 60 seconds.</p>
          <Link to="/interview" className="btn btn-primary">Start Your Practice Session</Link>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="hero-stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>
}
