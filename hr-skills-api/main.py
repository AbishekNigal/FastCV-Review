from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from dotenv import load_dotenv

from services.document_parser import parse_pdf
from services.llm_service import evaluate_resume
from pydantic import ValidationError

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="JD-Resume Balanced Evaluation API",
    description="An AI-assisted ATS evaluation backend based on a structured skills framework.",
    version="1.0.1"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, you should specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse, StreamingResponse
import json
import asyncio

@app.post("/evaluate", tags=["Evaluation"], summary="Evaluate multiple candidate resumes against a Job Description")
async def evaluate(
    job_description: str = Form(..., description="The raw requirements text of the Job Description."),
    resumes: List[UploadFile] = File(..., description="A list of candidate resumes (PDF only)")
):
    """
    Parses uploaded resumes and streams granular process logs and results.
    """
    
    async def process_stream():
        for resume in resumes:
            filename = resume.filename
            if not filename.lower().endswith(".pdf"):
                yield json.dumps({"type": "error", "message": "Use .pdf only", "filename": filename}) + "\n"
                continue
                
            try:
                yield json.dumps({"type": "log", "message": f"Starting processing: {filename}", "filename": filename}) + "\n"
                
                content = await resume.read()
                yield json.dumps({"type": "log", "message": "Parsing PDF metadata and content...", "filename": filename}) + "\n"
                
                # Parse PDF document to string
                resume_text = parse_pdf(content)
                    
                if len(resume_text.strip()) < 10:
                    yield json.dumps({"type": "error", "message": "Resume content too short.", "filename": filename}) + "\n"
                    continue
                    
                # Call LLM generator
                async for chunk in evaluate_resume(job_description, resume_text):
                    # Inject filename into chunks
                    chunk["filename"] = filename
                    if chunk["type"] == "result":
                        chunk["payload"]["Candidate_Source"] = filename
                    yield json.dumps(chunk) + "\n"
                    
            except Exception as e:
                logger.error(f"Error evaluating {filename}: {e}")
                yield json.dumps({"type": "error", "message": str(e), "filename": filename}) + "\n"

    return StreamingResponse(process_stream(), media_type="application/x-ndjson")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
