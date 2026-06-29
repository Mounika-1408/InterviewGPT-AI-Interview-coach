from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import (
    EvaluateAnswerRequest, EvaluateAnswerResponse,
    GenerateQuestionsResponse, InterviewSummaryRequest, InterviewSummaryResponse
)
from services import azure_openai_service, resume_parser

router = APIRouter()

@router.post("/upload-resume", response_model=GenerateQuestionsResponse)
async def upload_resume_and_generate(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    num_questions: int = Form(10)
):
    """Upload resume PDF and get generated interview questions."""
    try:
        resume_text = await resume_parser.extract_text_from_resume(file)
        if not resume_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from resume. Please check the file.")

        result = azure_openai_service.generate_questions(resume_text, job_role, num_questions)
        # Store resume text in result for frontend caching
        result_dict = result.dict()
        result_dict["resume_text"] = resume_text
        return result_dict

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")


@router.post("/evaluate", response_model=EvaluateAnswerResponse)
async def evaluate_answer(request: EvaluateAnswerRequest):
    """Evaluate a candidate's answer and return AI feedback."""
    try:
        result = azure_openai_service.evaluate_answer(
            question=request.question,
            answer=request.answer,
            job_role=request.job_role,
            resume_context=request.resume_context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@router.post("/summary", response_model=InterviewSummaryResponse)
async def get_interview_summary(request: InterviewSummaryRequest):
    """Generate a full interview session summary."""
    try:
        result = azure_openai_service.generate_summary(
            job_role=request.job_role,
            questions_and_answers=request.questions_and_answers
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")
