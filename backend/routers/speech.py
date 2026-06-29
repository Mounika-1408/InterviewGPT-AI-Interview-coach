from fastapi import APIRouter, HTTPException
from services.speech_service import get_speech_token
from models.schemas import SpeechTokenResponse

router = APIRouter()

@router.get("/token", response_model=SpeechTokenResponse)
async def fetch_speech_token():
    """Return a short-lived Azure Speech token for the frontend SDK."""
    try:
        result = await get_speech_token()
        return result
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch speech token: {str(e)}")
