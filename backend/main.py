import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from routes import disease, crop_recommendation, soil, weather, fertilizer, auth, chatbot
from utils.model_loader import initialize_models
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Agriculture Backend",
    description="APIs for crop disease detection, crop recommendation, soil analysis and weather integration",
    version="1.0.0",
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    initialize_models()


@app.get("/")
def root():
    return {"status": "ok", "message": "Smart Agriculture Backend is running"}


app.include_router(disease)
app.include_router(crop_recommendation)
app.include_router(soil)
app.include_router(weather)
app.include_router(fertilizer)
app.include_router(auth.router)
app.include_router(chatbot.router)