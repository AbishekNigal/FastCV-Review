export interface CategoryBreakdownItem {
    Category_Name: string;
    Weight: number;
    Score: number;
}

export interface RequirementMapping {
    Requirement: string;
    Type: string;
    Score: number;
    Evidence_Found: string;
}

export interface EvaluationResponse {
    Candidate_Source: string;
    Evaluation_Timestamp: string;
    Overall_Score: number;
    Recommendation: string;
    Confidence_Level: string;
    Role_Classification: string;
    Category_Breakdown: CategoryBreakdownItem[];
    Requirement_Mapping: RequirementMapping[];
    Strengths: string[];
    Gaps: string[];
    Risk_Flags: string[];
    Skill_Version: string;
    Framework_Version: string;
    error?: string;
}
