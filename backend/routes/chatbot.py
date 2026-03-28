import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
try:
    import google.generativeai as genai
    HAS_GENAI = True
except Exception as e:
    HAS_GENAI = False
    print(f"Skipping GenAI due to {e}")

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: str
    context: str = ""

@router.post("/")
async def chat_with_agribot(req: ChatRequest):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not HAS_GENAI or not api_key:
        raise HTTPException(
            status_code=500, 
            detail="AI Assistant is not configured. Please ensure google-generativeai is installed and GOOGLE_API_KEY is set."
        )
    
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
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
        response = model.generate_content(full_prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
