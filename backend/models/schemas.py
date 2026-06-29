from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    id: int
    question: str
    category: str  # technical, behavioral, situational
    difficulty: str  # easy, medium, hard

class GenerateQuestionsRequest(BaseModel):
    resume_text: str
    job_role: str
    num_questions: int = 10

class GenerateQuestionsResponse(BaseModel):
    questions: List[Question]
    job_role: str

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    job_role: str
    resume_context: str

class FeedbackDetail(BaseModel):
    score: int  # 0-100
    strengths: List[str]
    improvements: List[str]
    ideal_answer_hint: str
    communication_score: int
    content_score: int
    confidence_score: int

class EvaluateAnswerResponse(BaseModel):
    feedback: FeedbackDetail
    overall_score: int

class SpeechTokenResponse(BaseModel):
    token: str
    region: str

class InterviewSummaryRequest(BaseModel):
    job_role: str
    questions_and_answers: List[dict]

class InterviewSummaryResponse(BaseModel):
    overall_score: int
    total_questions: int
    strengths: List[str]
    areas_to_improve: List[str]
    recommendation: str
    detailed_scores: List[dict]
