import json
import traceback
from openai import AzureOpenAI
from config import settings
from models.schemas import (
    Question, GenerateQuestionsResponse,
    FeedbackDetail, EvaluateAnswerResponse,
    InterviewSummaryResponse
)
from typing import List

client = AzureOpenAI(
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
    api_key=settings.AZURE_OPENAI_API_KEY,
    api_version=settings.AZURE_OPENAI_API_VERSION
)

def chat(messages: list, temperature: float = 0.7) -> str:
    try:
        print(f"DEBUG: Calling Azure OpenAI with endpoint: {settings.AZURE_OPENAI_ENDPOINT}")
        print(f"DEBUG: Using deployment: {settings.AZURE_OPENAI_DEPLOYMENT}")
        response = client.chat.completions.create(
            model=settings.AZURE_OPENAI_DEPLOYMENT,
            messages=messages,
            temperature=temperature,
            max_completion_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        print("ERROR: Azure OpenAI chat call failed")
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        raise

def generate_questions(resume_text: str, job_role: str, num_questions: int) -> GenerateQuestionsResponse:
    try:
        print(f"DEBUG: Starting generate_questions for job_role: {job_role}, num_questions: {num_questions}")
        prompt = f"""You are an expert technical interviewer. Based on the resume and job role below, generate {num_questions} interview questions.

Job Role: {job_role}

Resume:
{resume_text}

Generate a mix of:
- Technical questions (based on skills in resume)
- Behavioral questions (STAR method)
- Situational questions

Return ONLY a valid JSON object in this exact format:
{{
  "questions": [
    {{
      "id": 1,
      "question": "...",
      "category": "technical",
      "difficulty": "medium"
    }}
  ]
}}

Category must be one of: technical, behavioral, situational
Difficulty must be one of: easy, medium, hard
Generate exactly {num_questions} questions."""

        print("DEBUG: Calling chat function...")
        raw = chat([{"role": "user", "content": prompt}], temperature=0.8)
        print(f"DEBUG: Received raw response from Azure OpenAI (length: {len(raw)})")

        # Strip markdown code fences if present
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("```")
        
        print(f"DEBUG: Cleaned response (length: {len(raw)})")
        print(f"DEBUG: Response content: {raw[:200]}...")

        data = json.loads(raw)
        print(f"DEBUG: Successfully parsed JSON with {len(data.get('questions', []))} questions")
        questions = [Question(**q) for q in data["questions"]]
        return GenerateQuestionsResponse(questions=questions, job_role=job_role)
    except Exception as e:
        print("ERROR: generate_questions failed")
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        raise


def evaluate_answer(question: str, answer: str, job_role: str, resume_context: str) -> EvaluateAnswerResponse:
    try:
        print(f"DEBUG: Starting evaluate_answer for job_role: {job_role}")
        prompt = f"""You are an expert interview coach evaluating a candidate's answer.

Job Role: {job_role}
Resume Context: {resume_context[:500]}

Question: {question}
Candidate's Answer: {answer}

Evaluate the answer on:
1. Content relevance and accuracy (0-100)
2. Communication clarity (0-100)
3. Confidence and structure (0-100)

Return ONLY a valid JSON object:
{{
  "feedback": {{
    "score": <overall 0-100>,
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "ideal_answer_hint": "Brief hint on what a great answer looks like",
    "communication_score": <0-100>,
    "content_score": <0-100>,
    "confidence_score": <0-100>
  }},
  "overall_score": <0-100>
}}"""

        print("DEBUG: Calling chat function for evaluation...")
        raw = chat([{"role": "user", "content": prompt}], temperature=0.5)
        print(f"DEBUG: Received evaluation response (length: {len(raw)})")
        
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("```")

        data = json.loads(raw)
        print("DEBUG: Successfully parsed evaluation JSON")
        feedback = FeedbackDetail(**data["feedback"])
        return EvaluateAnswerResponse(feedback=feedback, overall_score=data["overall_score"])
    except Exception as e:
        print("ERROR: evaluate_answer failed")
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        raise


def generate_summary(job_role: str, questions_and_answers: List[dict]) -> InterviewSummaryResponse:
    try:
        print(f"DEBUG: Starting generate_summary for job_role: {job_role}")
        qa_text = "\n".join([
            f"Q: {qa['question']}\nA: {qa['answer']}\nScore: {qa.get('score', 'N/A')}"
            for qa in questions_and_answers
        ])

        prompt = f"""You are an expert interview coach. Summarize this complete interview session.

Job Role: {job_role}

Interview Transcript:
{qa_text}

Return ONLY valid JSON:
{{
  "overall_score": <0-100 average>,
  "total_questions": {len(questions_and_answers)},
  "strengths": ["top strength 1", "top strength 2", "top strength 3"],
  "areas_to_improve": ["area 1", "area 2", "area 3"],
  "recommendation": "Hire / Maybe / Not Ready — with one sentence reason",
  "detailed_scores": [
    {{"question_id": 1, "score": 85, "category": "technical"}}
  ]
}}"""

        print("DEBUG: Calling chat function for summary...")
        raw = chat([{"role": "user", "content": prompt}], temperature=0.4)
        print(f"DEBUG: Received summary response (length: {len(raw)})")
        
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("```")

        data = json.loads(raw)
        print("DEBUG: Successfully parsed summary JSON")
        return InterviewSummaryResponse(**data)
    except Exception as e:
        print("ERROR: generate_summary failed")
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        raise

