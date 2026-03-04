from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class CategoryBreakdownItem(BaseModel):
    Category_Name: str
    Weight: float
    Score: float

class RequirementMapping(BaseModel):
    Requirement: str
    Type: str
    Score: float
    Evidence_Found: str

class EvaluationResponse(BaseModel):
    Candidate_Source: str
    Evaluation_Timestamp: str
    Overall_Score: float
    Recommendation: str
    Confidence_Level: str
    Role_Classification: str
    # Refactored from Dict to List to support Gemini's strict schema requirements
    Category_Breakdown: List[CategoryBreakdownItem]
    Requirement_Mapping: List[RequirementMapping]
    Strengths: List[str]
    Gaps: List[str]
    Risk_Flags: List[str]
    Skill_Version: str
    Framework_Version: str
