import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ResumeUpload from '../components/ResumeUpload'
import VoiceInput from '../components/VoiceInput'
import FeedbackPanel from '../components/FeedbackPanel'
import ScoreRing from '../components/ScoreRing'
import { uploadResume, evaluateAnswer, getInterviewSummary } from '../utils/api'
import Loader from '../components/Loader'
import './Interview.css'

const PHASES = { SETUP: 'setup', QUESTIONS: 'questions', DONE: 'done' }

export default function Interview() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(PHASES.SETUP)
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState('')
  const [numQuestions, setNumQuestions] = useState(8)
  const [loading, setLoading] = useState(false)

  // Session state
  const [questions, setQuestions] = useState([])
  const [resumeText, setResumeText] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState([])

  const startInterview = async () => {
    if (!file) { toast.error('Please upload your resume'); return }
    if (!jobRole.trim()) { toast.error('Please enter a job role'); return }
    setLoading(true)
    try {
      const data = await uploadResume(file, jobRole, numQuestions)
      setQuestions(data.questions)
      setResumeText(data.resume_text || '')
      setPhase(PHASES.QUESTIONS)
      toast.success(`${data.questions.length} questions generated!`)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please provide an answer before submitting'); return }
    setEvaluating(true)
    setFeedback(null)
    try {
      const q = questions[currentIdx]
      const result = await evaluateAnswer(q.question, answer, jobRole, resumeText)
      setFeedback(result)
      setSessionAnswers(prev => [...prev, {
        question: q.question,
        answer,
        score: result.overall_score,
        category: q.category
      }])
    } catch (e) {
      toast.error('Failed to evaluate answer. Please try again.')
    } finally {
      setEvaluating(false)
    }
  }

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      finishInterview()
    } else {
      setCurrentIdx(i => i + 1)
      setAnswer('')
      setFeedback(null)
    }
  }

  const finishInterview = async () => {
    if (sessionAnswers.length === 0) {
      toast.error('Answer at least one question before finishing.')
      return
    }
    setLoading(true)
    try {
      const summary = await getInterviewSummary(jobRole, sessionAnswers)
      navigate('/results', { state: { summary, jobRole, sessionAnswers } })
    } catch (e) {
      toast.error('Failed to generate summary')
      setLoading(false)
    }
  }

  const skipQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      finishInterview()
    } else {
      setCurrentIdx(i => i + 1)
      setAnswer('')
      setFeedback(null)
    }
  }

  if (phase === PHASES.SETUP) {
    return (
      <div className="interview-page">
        {loading && <Loader message="Analysing your resume and generating questions…" />}
        <div className="container">
          <div className="setup-header">
            <p className="section-label">Setup</p>
            <h1>Configure your practice session</h1>
            <p className="setup-sub">Upload your resume and tell us what role you're targeting.</p>
          </div>

          <div className="setup-form">
            <div className="setup-card card">
              <ResumeUpload onFileSelect={setFile} file={file} />

              <div className="form-group">
                <label htmlFor="jobRole">Target Job Role</label>
                <input
                  id="jobRole"
                  type="text"
                  placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="numQ">Number of Questions: <strong style={{color:'var(--cyan)'}}>{numQuestions}</strong></label>
                <input
                  id="numQ"
                  type="range"
                  min={5} max={15} step={1}
                  value={numQuestions}
                  onChange={e => setNumQuestions(+e.target.value)}
                  className="range-input"
                />
                <div className="range-labels"><span>5</span><span>15</span></div>
              </div>

              <button className="btn btn-primary start-btn" onClick={startInterview} disabled={loading}>
                {loading ? <Spinner /> : '🚀 Generate Questions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentIdx]
  const progress = ((currentIdx + (feedback ? 1 : 0)) / questions.length) * 100

  return (
    <div className="interview-page">
      {loading && <Loader message="Generating your session report…" />}
      <div className="container">
        {/* Progress bar */}
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: progress + '%' }} />
        </div>

        <div className="interview-meta">
          <span className="meta-role">📋 {jobRole}</span>
          <span className="meta-count">Question {currentIdx + 1} / {questions.length}</span>
        </div>

        {/* Question card */}
        <div className="question-card card">
          <div className="question-tags">
            <span className={`tag tag-${q.category}`}>{q.category}</span>
            <span className={`tag tag-${q.difficulty}`}>{q.difficulty}</span>
          </div>
          <p className="question-text">{q.question}</p>
        </div>

        {/* Answer area */}
        {!feedback && (
          <div className="answer-area card">
            <VoiceInput value={answer} onChange={setAnswer} disabled={evaluating} />
            <div className="answer-actions">
              <button className="btn btn-ghost" onClick={skipQuestion} disabled={evaluating}>Skip</button>
              <button className="btn btn-primary" onClick={submitAnswer} disabled={evaluating || !answer.trim()}>
                {evaluating ? <><Spinner /> Evaluating...</> : 'Submit Answer →'}
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <>
            <FeedbackPanel feedback={feedback.feedback} overallScore={feedback.overall_score} />
            <div className="next-actions">
              {currentIdx + 1 < questions.length ? (
                <button className="btn btn-primary" onClick={nextQuestion}>Next Question →</button>
              ) : (
                <button className="btn btn-primary" onClick={finishInterview} disabled={loading}>
                  {loading ? <Spinner /> : '🏁 See Full Report'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return <span className="spinner" />
}
