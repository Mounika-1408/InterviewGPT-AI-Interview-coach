import { useState, useRef, useCallback } from 'react'
import { getSpeechToken } from '../utils/api'

export function useAzureSpeech() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognizerRef = useRef(null)

  const startListening = useCallback(async () => {
    setError(null)
    setTranscript('')

    try {
      const sdk = await import('microsoft-cognitiveservices-speech-sdk')

      const { token, region } = await getSpeechToken()

      const authConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
      authConfig.speechRecognitionLanguage = 'en-US'

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
      const recognizer = new sdk.SpeechRecognizer(authConfig, audioConfig)

      recognizerRef.current = recognizer
      setIsListening(true)

      // FINAL recognized text only
      recognizer.recognized = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          setTranscript(prev => {
            const combined = prev
              ? prev + ' ' + e.result.text
              : e.result.text
            return combined.trim()
          })
        }
      }

      recognizer.canceled = (_, e) => {
        setIsListening(false)

        if (e.reason === sdk.CancellationReason.Error) {
          setError('Speech recognition error: ' + e.errorDetails)
        }

        recognizer.close()
        recognizerRef.current = null
      }

      recognizer.sessionStopped = () => {
        setIsListening(false)
        recognizer.close()
        recognizerRef.current = null
      }

      recognizer.startContinuousRecognitionAsync(
        () => {},
        (err) => {
          setError('Could not start microphone: ' + err)
          setIsListening(false)
        }
      )

    } catch (err) {
      setError(`Failed to initialize speech: ${err?.message || err}`)
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          recognizerRef.current.close()
          recognizerRef.current = null
          setIsListening(false)
        },
        (err) => {
          console.error(err)
          setIsListening(false)
        }
      )
    }
  }, [])

  return {
    isListening,
    transcript,
    setTranscript,
    error,
    startListening,
    stopListening
  }
}