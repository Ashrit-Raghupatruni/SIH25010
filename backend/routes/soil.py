from fastapi import APIRouter
from models.schemas import SoilAnalysisInput, SoilAnalysisOutput

router = APIRouter(prefix="/soil", tags=["soil"])


@router.post("/analyze", response_model=SoilAnalysisOutput)
async def analyze_soil(payload: SoilAnalysisInput):
    status = "OK"
    message = "Soil data accepted. Future report generation pending."

    if payload.ph < 6.0:
        message = "Acidic soil; consider lime application."
    elif payload.ph > 7.5:
        message = "Alkaline soil; consider sulfur application."

    return SoilAnalysisOutput(status=status, message=message, ocr_ready=True)
