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

@app.post("/evaluate", tags=["Evaluation"], summary="Evaluate multiple candidate resumes against a Job Description")
async def evaluate(
    job_description: str = Form(..., description="The raw requirements text of the Job Description."),
    resumes: List[UploadFile] = File(..., description="A list of candidate resumes (PDF only)")
):
    """
    Parses multiple uploaded resumes and scores them against the provided Job Description.
    Returns a list of strictly validated evaluation JSON payloads.
    """
    results = []
    
    for resume in resumes:
        filename = resume.filename.lower()
        if not filename.endswith(".pdf"):
            # We append an error result for this specific file instead of failing the whole batch
            results.append({"filename": resume.filename, "error": "Unsupported file type. Use .pdf only"})
            continue
            
        try:
            content = await resume.read()
            
            # Parse PDF document to string
            resume_text = parse_pdf(content)
                
            if len(resume_text.strip()) < 10:
                results.append({"filename": resume.filename, "error": "Extracted text too short or empty."})
                continue
                
            # Call LLM logic
            logger.info(f"Evaluating resume: {resume.filename}...")
            evaluation = await evaluate_resume(job_description, resume_text)
            
            # Attach the filename to the response before returning
            evaluation_dict = evaluation.model_dump()
            evaluation_dict["Candidate_Source"] = resume.filename
            
            results.append(evaluation_dict)
            
        except Exception as e:
            logger.error(f"Error evaluating {resume.filename}: {e}")
            results.append({"filename": resume.filename, "error": str(e)})
            
    return JSONResponse(status_code=status.HTTP_200_OK, content=results)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
