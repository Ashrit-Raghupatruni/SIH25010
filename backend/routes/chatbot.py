import requests
import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: str
    context: str = ""

@router.post("/")
def chat_with_agribot(req: ChatRequest):
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        api_key = api_key.strip()
        
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="AI Assistant is not configured. Please ensure GOOGLE_API_KEY is set."
        )

    system_prompt = f"""
You are AgriBot, an expert agricultural assistant designed to help farmers.
You MUST respond in the following language: {req.language}.
If the language is 'te' or 'Telugu', respond in Telugu script.
If the language is 'hi' or 'Hindi', respond in Hindi script.
If the language is 'en' or 'English', respond in English.

Here is the recent context from the user's dashboard (e.g., soil analysis, plant disease detected):
{req.context if req.context else "No active context."}

Your advice should be practical, farmer-friendly, and actionable. Keep your response concise (under 3-4 sentences) so it can be easily read out loud by a voice synthesizer. Avoid markdown formatting like asterisks or hash symbols, keep it plain text suitable for speech.
"""

    full_prompt = f"{system_prompt}\n\nFarmer says: {req.message}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{"parts":[{"text": full_prompt}]}]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        resp_json = response.json()
        
        bot_response = resp_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        print("FULL GEMINI RESPONSE:", resp_json)
        if not bot_response:
            return {"response": "Sorry, I am having trouble understanding the response."}
            
        return {"response": bot_response}

    except Exception as e:
        print("Error calling Gemini API:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
