import axios from 'axios'

const api = axios.create({
  baseURL: 'https://interviewgpt-ai-interview-coach-production.up.railway.app',
  timeout: 60000,
})

export const uploadResume = async (file, jobRole, numQuestions = 10) => {
  const form = new FormData()
  form.append('file', file)
  form.append('job_role', jobRole)
  form.append('num_questions', numQuestions)
  const { data } = await api.post('/interview/upload-resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const evaluateAnswer = async (question, answer, jobRole, resumeContext) => {
  const { data } = await api.post('/interview/evaluate', {
    question,
    answer,
    job_role: jobRole,
    resume_context: resumeContext
  })
  return data
}

export const getInterviewSummary = async (jobRole, questionsAndAnswers) => {
  const { data } = await api.post('/interview/summary', {
    job_role: jobRole,
    questions_and_answers: questionsAndAnswers
  })
  return data
}

export const getSpeechToken = async () => {
  const { data } = await api.get('/speech/token')
  return data
}

export default api
