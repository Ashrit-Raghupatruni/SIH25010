import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/chat", tags=["chatbot"])


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: str = ""


@router.post("/")
def chat_with_agribot(req: ChatRequest):
    api_key = os.getenv("nvidia_nim_api")
    if api_key:
        api_key = api_key.strip()

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="AI Assistant is not configured. Please ensure nvidia_nim_api is set in .env",
        )

    system_prompt = f"""You are AgriBot, an expert agricultural assistant designed to help farmers with crop management, disease diagnosis, fertilizer advice, weather impact, and market insights.

Respond in the following language: {req.language}.
If the language is 'te' or 'Telugu', respond entirely in Telugu script.
If the language is 'hi' or 'Hindi', respond entirely in Hindi script.
If the language is 'en' or 'English', respond in English.

Current context from the farmer's dashboard:
{req.context if req.context else "No active context provided."}

Guidelines:
- Be practical, concise, and farmer-friendly.
- Keep responses under 4 sentences so they can be read aloud easily.
- Avoid markdown symbols like **, ## or bullet points — use plain text suitable for speech.
- Always be encouraging and supportive."""

    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "meta/llama-3.1-70b-instruct",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.message},
        ],
        "temperature": 0.7,
        "max_tokens": 512,
        "stream": False,
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        resp_json = response.json()

        bot_response = (
            resp_json.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
            .strip()
        )

        print("NVIDIA NIM response:", bot_response[:200])

        if not bot_response:
            return {"response": "Sorry, I could not generate a response. Please try again."}

        return {"response": bot_response}

    except requests.exceptions.HTTPError as e:
        detail = f"NVIDIA NIM API error: {e.response.status_code} - {e.response.text}"
        print(detail)
        raise HTTPException(status_code=502, detail=detail)
    except Exception as e:
        print("Error calling NVIDIA NIM API:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
