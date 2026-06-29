import { useEffect } from 'react'
import { useAzureSpeech } from '../hooks/useAzureSpeech'
import './VoiceInput.css'

export default function VoiceInput({ value, onChange, disabled }) {
  const { isListening, transcript, setTranscript, error, startListening, stopListening } = useAzureSpeech()

  // Sync transcript into parent textarea
  useEffect(() => {
    if (transcript) onChange(transcript)
  }, [transcript])

  const toggle = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const handleTextChange = (e) => {
    setTranscript(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="voice-input">
      <div className="voice-input-header">
        <label>Your Answer</label>
        <button
          type="button"
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggle}
          disabled={disabled}
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          {isListening ? (
            <>
              <span className="mic-pulse" />
              <MicIcon />
              <span>Stop</span>
            </>
          ) : (
            <>
              <MicIcon />
              <span>Voice Input</span>
            </>
          )}
        </button>
      </div>

      {isListening && (
        <div className="voice-status">
          <span className="voice-dot" />
          Listening... speak your answer
        </div>
      )}

      {error && <p className="voice-error">{error}</p>}

      <textarea
        rows={6}
        placeholder="Type your answer here, or click Voice Input to speak..."
        value={value}
        onChange={handleTextChange}
        disabled={disabled}
      />
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 7a1 1 0 0 1 1 1 8 8 0 0 1-7 7.94V21h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-2.06A8 8 0 0 1 4 11a1 1 0 0 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/>
    </svg>
  )
}
