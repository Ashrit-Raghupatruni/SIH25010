from pydantic import BaseModel, Field, conint, confloat


class CropRecommendationInput(BaseModel):
    nitrogen: conint(ge=0, le=300) = Field(..., description="Nitrogen (N) in soil")
    phosphorus: conint(ge=0, le=300) = Field(..., description="Phosphorus (P) in soil")
    potassium: conint(ge=0, le=300) = Field(..., description="Potassium (K) in soil")
    ph: confloat(ge=3.5, le=10.0) = Field(..., description="Soil pH")
    temperature: confloat(ge=-20.0, le=60.0) = Field(..., description="Degrees Celsius")
    humidity: confloat(ge=0.0, le=100.0) = Field(..., description="Relative humidity percentage")
    rainfall: confloat(ge=0.0, le=1000.0) = Field(..., description="Rainfall in mm")


class SoilAnalysisInput(BaseModel):
    nitrogen: conint(ge=0, le=500) = Field(..., description="Soil Nitrogen level")
    phosphorus: conint(ge=0, le=500) = Field(..., description="Soil Phosphorus level")
    potassium: conint(ge=0, le=500) = Field(..., description="Soil Potassium level")
    ph: confloat(ge=3.5, le=10.0) = Field(..., description="Soil pH")


class SoilAnalysisOutput(BaseModel):
    status: str
    message: str
    ocr_ready: bool

class SmartCropInput(BaseModel):
    location: str
    nitrogen: int
    phosphorus: int
    potassium: int
    ph: float

class FertilizerInput(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: int
    potassium: int
    phosphorus: int