import httpx
from config import settings

async def get_speech_token() -> dict:
    """Fetch a short-lived Azure Speech token for the frontend."""
    if not settings.AZURE_SPEECH_KEY or not settings.AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech credentials are not configured in .env")

    token_url = f"https://{settings.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            token_url,
            headers={"Ocp-Apim-Subscription-Key": settings.AZURE_SPEECH_KEY},
            timeout=10.0
        )
        response.raise_for_status()
        token = response.text

    return {"token": token, "region": settings.AZURE_SPEECH_REGION}
