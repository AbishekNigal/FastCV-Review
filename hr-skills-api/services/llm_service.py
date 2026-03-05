import os
import logging
from google import genai
from models import EvaluationResponse
from pydantic import ValidationError

import hashlib
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Global cache for system instructions
_SYSTEM_INSTRUCTION_CACHE = None
# Global client instance
_CLIENT = None
# Context cache registry: {jd_hash: (cache_name, expiry)}
_CONTEXT_CACHE_REGISTRY = {}

def get_client() -> genai.Client:
    global _CLIENT
    if _CLIENT is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")
        _CLIENT = genai.Client(api_key=api_key)
    return _CLIENT

def get_system_instruction() -> str:
    global _SYSTEM_INSTRUCTION_CACHE
    if _SYSTEM_INSTRUCTION_CACHE is None:
        skills_path = os.path.join(os.path.dirname(__file__), "..", "skills.md")
        try:
            with open(skills_path, "r", encoding="utf-8") as f:
                _SYSTEM_INSTRUCTION_CACHE = f.read()
        except Exception as e:
            logger.error(f"Failed to read skills.md: {e}")
            raise ValueError("System instructions (skills.md) could not be loaded.")
    return _SYSTEM_INSTRUCTION_CACHE

def get_or_create_context_cache(job_description: str) -> tuple[str | None, str]:
    """
    Creates or retrieves a CachedContent for the given JD + System Instructions.
    Returns (cache_name, status_message).
    """
    client = get_client()
    system_instruction = get_system_instruction()
    
    # Create a unique hash for this JD + instructions
    content_to_hash = f"{system_instruction}{job_description}"
    jd_hash = hashlib.sha256(content_to_hash.encode()).hexdigest()
    
    # Check if we have a valid cache in our local registry
    if jd_hash in _CONTEXT_CACHE_REGISTRY:
        cache_name, expiry = _CONTEXT_CACHE_REGISTRY[jd_hash]
        if datetime.now() < expiry:
            return cache_name, "Optimizing with existing Context Cache..."
        else:
            # Cache expired in our registry, though it might still exist on server
            # We'll just create a new one for simplicity in this demo
            logger.info("Context cache expired in local registry.")
            del _CONTEXT_CACHE_REGISTRY[jd_hash]

    # Create new cache on Gemini server
    try:
        cache = client.caches.create(
            model='models/gemini-2.5-flash',
            config=genai.types.CreateCacheConfig(
                system_instruction=system_instruction,
                contents=[job_description],
                ttl_seconds=3600  # 1 hour TTL
            )
        )
        
        # Store in registry
        expiry = datetime.now() + timedelta(seconds=3600)
        _CONTEXT_CACHE_REGISTRY[jd_hash] = (cache.name, expiry)
        return cache.name, "Creating new Context Cache for this Job... (Cost Optimized)"
        
    except Exception as e:
        logger.warning(f"Failed to create context cache: {e}. Falling back to standard generation.")
        return None, "Proceeding without Context Cache (Standard Mode)..."

async def evaluate_resume(job_description: str, resume_text: str):
    """
    Async generator that yields status logs and finally the evaluation result.
    """
    client = get_client()
    
    yield {"type": "log", "message": "Analyzing document structure..."}
    
    # Try to get/create a context cache for the JD
    cache_name, cache_status = get_or_create_context_cache(job_description)
    yield {"type": "log", "message": cache_status}
    
    yield {"type": "log", "message": "AI Reasoning using Gemini 2.5 Flash..."}
    
    try:
        if cache_name:
            # Use cached content
            response = await client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Candidate Resume:\n{resume_text}",
                config=genai.types.GenerateContentConfig(
                    cached_content=cache_name,
                    response_mime_type="application/json",
                    response_schema=EvaluationResponse,
                    temperature=0.0
                )
            )
        else:
            # Fallback to standard request
            system_instruction = get_system_instruction()
            prompt = f"Job Description:\n{job_description}\n\nCandidate Resume:\n{resume_text}"
            response = await client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=EvaluationResponse,
                    temperature=0.0
                )
            )
        
        result = EvaluationResponse.model_validate_json(response.text)
        yield {"type": "log", "message": "Refining scores and matching skills..."}
        yield {"type": "result", "payload": result.model_dump()}
        
    except ValidationError as ve:
        logger.error(f"LLM Response failed Pydantic validation: {ve}")
        yield {"type": "error", "message": "The AI model returned an unexpected format."}
    except Exception as e:
        logger.error(f"Error calling Gemini AI API: {e}")
        yield {"type": "error", "message": f"An error occurred: {str(e)}"}
