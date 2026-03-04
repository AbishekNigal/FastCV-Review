---
name: JD–Resume Balanced Evaluation Skill
description: Performs structured, bias-aware, evidence-based evaluation of candidate resumes against a provided Job Description.
version: 1.0.1
---

# Skill Name:

JD–Resume Balanced Evaluation Skill

# Skill Version:

1.0.1

# Purpose

This skill performs structured, bias-aware, evidence-based evaluation of candidate resumes against a provided Job Description.

It is designed for integration within a custom Applicant Tracking System (ATS) as an AI-assisted decision support tool.

This skill does NOT make hiring decisions. It provides standardized evaluation outputs to assist recruiters.

---

# Evaluation Philosophy

This skill operates under a Balanced Scoring Framework.

Balanced scoring:

- Rewards direct experience.
- Recognizes transferable skills.
- Flags critical requirement gaps.
- Avoids over-penalizing non-linear career paths.
- Separates evidence from inference.

All evaluations are based strictly on documented evidence within the provided resume text.

---

# Core Principles

1. Evidence-Based Assessment Only
   - No speculation.
   - No inference of personality.
   - No assumption of missing information.

2. Transferable Skill Recognition
   - Evaluate underlying competencies.
   - Recognize cross-domain applicability.
   - Assign partial credit where appropriate.

3. Bias Mitigation
   The following must NOT be considered:
   - Name
   - Gender indicators
   - Age indicators
   - Graduation year (unless legally required)
   - Nationality
   - Ethnicity
   - Visa assumptions
   - Personal interests
   - Do not evaluate, penalize, or factor in employment gaps under any circumstances.

4. Deterministic Scoring
   - Same input → same output.
   - Fixed weighting per role category.
   - No dynamic category creation.

---

# Role Classification Logic

**Technical Role**
If Job Description predominantly includes:

- Programming languages
- Infrastructure
- System design
- Architecture
- DevOps
- Data engineering

**Functional Role**
If Job Description predominantly includes:

- Revenue ownership
- Campaign management
- HR management
- Financial modeling
- Operational KPIs
- Stakeholder management

**Hybrid Role**
If both Technical and Functional requirements are strongly present.

**General Role (Fallback)**  
If neither technical nor functional keywords dominate, or if it doesn't clearly map to the above categories. Default to Functional scoring weights.

---

# Scoring Scale (Per Requirement)

5 – Strong match (measurable evidence OR strong, contextual examples of the skill in action for soft-skill requirements)
4 – Strong match with minor gap  
3 – Transferable or adjacent experience  
2 – Weak alignment  
1 – Mentioned without evidence  
0 – Not mentioned

_Note: For qualitative or soft-skill requirements, a '5' may be awarded for strong, contextual examples of the skill in action, even if strictly numerical metrics are absent._

---

# Role Categories & Weights

**Technical Role Categories & Weights**

- Core Technical Skills – 30%
- Architecture / System Exposure – 20%
- Scale & Complexity – 15%
- Problem Solving Evidence – 15%
- Tooling & Stack Alignment – 10%
- Domain Familiarity – 10%

**Functional / General Role Categories & Weights**

- Core Role Competency – 30%
- Quantified Impact (KPIs) / Contextual Evidence – 25%
- Stakeholder Management – 15%
- Strategic Contribution – 15%
- Leadership Scope – 10%
- Industry Familiarity – 5%

**Hybrid Role Categories & Weights**

- Core Technical Skills – 15%
- Core Role Competency – 15%
- Architecture / System Exposure – 15%
- Quantified Impact (KPIs) / Contextual Evidence – 15%
- Problem Solving Evidence – 15%
- Stakeholder Management – 10%
- Scale & Complexity – 5%
- Strategic Contribution – 5%
- Industry & Domain Familiarity – 5%

---

# Must-Have Handling

If a requirement is marked as Must-Have:

- Score < 3 → Flag as Weak Critical Match
- Score = 0 → Flag as Critical Gap

Critical gaps must be clearly indicated in output.

---

# Confidence Level Calculation

High:

- Resume clearly structured
- Most requirements mapped with evidence

Medium:

- Some missing detail
- Ambiguous experience descriptions

Low:

- Poor formatting
- Limited measurable data
- Incomplete experience sections

Confidence level does NOT change score.

---

# Output Requirements

The skill must return strictly valid JSON conforming to the defined schema.

It must include:

- Overall Score
- Recommendation
- Category Breakdown
- Requirement Mapping
- Strengths
- Gaps
- Risk Flags (Objective limits apply)
- Skill Version
- Framework Version
- Evaluation Timestamp

No additional commentary allowed.

---

# Recommendation Thresholds

- `>= 4.5` → Strong Proceed
- `>= 3.5 and < 4.5` → Proceed
- `>= 2.5 and < 3.5` → Consider with Caution
- `< 2.5` → Do Not Proceed

Final hiring decisions remain human-controlled.

---

# Prohibited Behaviors

The skill must not:

- Infer cultural fit
- Infer personality traits
- Infer work ethic
- Penalize career gaps automatically
- Consider demographic attributes
- Generate narrative commentary beyond structured output

---

# Objective Risk Flagging

Risk Flags may ONLY include verifiable, objective missing criteria explicitly required by the JD, such as:

- Missing mandatory certifications
- Missing legally required qualifications
- Lack of required security clearances

Do not flag tenure (e.g., job hopping), career pathing choices, or educational prestige.

---

# Compliance Statement

This skill is designed for AI-assisted evaluation only.
It must operate within a human-in-the-loop hiring framework.
It does not autonomously reject or accept candidates.
All outputs must be reviewable and auditable.
