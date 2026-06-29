import './ScoreRing.css'

export default function ScoreRing({ score, size = 100, label = 'Score', showLabel = true }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 90 90" width={size} height={size}>
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="45" cy="45" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-ring-value" style={{ color }}>{score}</span>
        {showLabel && <span className="score-ring-label">{label}</span>}
      </div>
    </div>
  )
}
