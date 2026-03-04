import os
import logging
from google import genai
from models import EvaluationResponse
from pydantic import ValidationError

logger = logging.getLogger(__name__)

def evaluate_resume(job_description: str, resume_text: str) -> EvaluationResponse:
    """
    Sends the job description and candidate resume to Gemini, bounded by the skills.md system instructions.
    Returns a strictly validated EvaluationResponse Pydantic map.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing.")
        
    client = genai.Client(api_key=api_key)
    
    # Load the skills directory instruction prompt
    skills_path = os.path.join(os.path.dirname(__file__), "..", "skills.md")
    try:
        with open(skills_path, "r", encoding="utf-8") as f:
            system_instruction = f.read()
    except Exception as e:
        logger.error(f"Failed to read skills.md: {e}")
        raise ValueError("System instructions (skills.md) could not be loaded.")
        
    prompt = f"Job Description:\n{job_description}\n\nCandidate Resume:\n{resume_text}"
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=EvaluationResponse,
                temperature=0.0
            )
        )
        
        # Parse the JSON response text into our strict validation model
        # Pydantic handles checking if the keys match and structures the nested Dicts
        return EvaluationResponse.model_validate_json(response.text)
        
    except ValidationError as ve:
        logger.error(f"LLM Response failed Pydantic validation: {ve}")
        raise ValueError("The AI model returned an unexpected format. Please try again.")
    except Exception as e:
        logger.error(f"Error calling Gemini AI API: {e}")
        raise ValueError(f"An error occurred while evaluating the resume: {str(e)}")
