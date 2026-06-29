import ScoreRing from './ScoreRing'
import './FeedbackPanel.css'

export default function FeedbackPanel({ feedback, overallScore }) {
  if (!feedback) return null

  return (
    <div className="feedback-panel">
      <div className="feedback-header">
        <h3>AI Feedback</h3>
        <ScoreRing score={overallScore} size={80} label="Score" />
      </div>

      <div className="score-breakdown">
        <ScorePill label="Content" score={feedback.content_score} />
        <ScorePill label="Communication" score={feedback.communication_score} />
        <ScorePill label="Confidence" score={feedback.confidence_score} />
      </div>

      <div className="feedback-sections">
        <div className="feedback-section">
          <h4 className="feedback-section-title strengths-title">✓ Strengths</h4>
          <ul>
            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="feedback-section">
          <h4 className="feedback-section-title improvements-title">↑ To Improve</h4>
          <ul>
            {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>

      <div className="ideal-hint">
        <span className="hint-label">💡 Ideal answer hint</span>
        <p>{feedback.ideal_answer_hint}</p>
      </div>
    </div>
  )
}

function ScorePill({ label, score }) {
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
  const pct = score + '%'
  return (
    <div className="score-pill">
      <div className="score-pill-header">
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{score}</span>
      </div>
      <div className="score-pill-bar">
        <div className="score-pill-fill" style={{ width: pct, background: color }} />
      </div>
    </div>
  )
}
