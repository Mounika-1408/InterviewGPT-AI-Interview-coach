import { useLocation, useNavigate, Link } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import './Results.css'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.summary) {
    return (
      <div className="results-page">
        <div className="container results-empty">
          <h2>No results found</h2>
          <p>Complete an interview session first.</p>
          <Link to="/interview" className="btn btn-primary">Start Practice</Link>
        </div>
      </div>
    )
  }

  const { summary, jobRole, sessionAnswers } = state
  const rec = summary.recommendation || ''
  const recColor = rec.toLowerCase().startsWith('hire') ? 'var(--green)'
    : rec.toLowerCase().startsWith('maybe') ? 'var(--amber)'
    : 'var(--red)'

  return (
    <div className="results-page">
      <div className="container">
        <header className="results-header">
          <p className="section-label">Session Complete</p>
          <h1>Your Interview Report</h1>
          <p className="results-sub">Role: <strong>{jobRole}</strong> · {summary.total_questions} questions answered</p>
        </header>

        {/* Hero score */}
        <div className="results-hero card">
          <div className="results-hero-score">
            <ScoreRing score={summary.overall_score} size={140} label="Overall" />
            <div>
              <h2 className="results-verdict" style={{ color: recColor }}>{summary.recommendation}</h2>
              <p className="results-verdict-sub">Based on your session performance</p>
            </div>
          </div>
        </div>

        {/* Strengths & improvements */}
        <div className="results-insights">
          <div className="card">
            <h3 className="insight-title" style={{ color: 'var(--green)' }}>✓ Your Strengths</h3>
            <ul className="insight-list">
              {summary.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card">
            <h3 className="insight-title" style={{ color: 'var(--amber)' }}>↑ Areas to Improve</h3>
            <ul className="insight-list">
              {summary.areas_to_improve.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Per-question breakdown */}
        <section className="results-breakdown">
          <h2>Question Breakdown</h2>
          <div className="breakdown-list">
            {sessionAnswers.map((qa, i) => {
              const score = qa.score ?? 0
              const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
              return (
                <div key={i} className="breakdown-item card">
                  <div className="breakdown-left">
                    <span className={`tag tag-${qa.category}`}>{qa.category}</span>
                    <p className="breakdown-q">{qa.question}</p>
                    <p className="breakdown-a">"{qa.answer.slice(0, 160)}{qa.answer.length > 160 ? '…' : ''}"</p>
                  </div>
                  <div className="breakdown-score" style={{ color }}>{score}<span>/100</span></div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="results-actions">
          <button className="btn btn-ghost" onClick={() => window.print()}>🖨 Print Report</button>
          <Link to="/interview" className="btn btn-primary">Practice Again →</Link>
        </div>
      </div>
    </div>
  )
}
