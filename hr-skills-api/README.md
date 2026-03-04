# JD-Resume Balanced Evaluation System

## Project Overview

The **JD-Resume Balanced Evaluation System** is an AI-assisted decision support framework designed to be integrated seamlessly into Applicant Tracking Systems (ATS) and HR recruitment pipelines. This project ensures an objective, structured, and bias-aware evaluation of candidate resumes against specific Job Descriptions (JDs), removing human subjectivity from the initial screening process while keeping hiring decisions strictly human-in-the-loop.

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Project Architecture](#project-architecture)
3. [Evaluation Framework](#evaluation-framework)
4. [Bias Mitigation & Compliance](#bias-mitigation--compliance)
5. [Integration Guide (ATS)](#integration-guide-ats)
6. [Expected Output Schema](#expected-output-schema)

---

## Core Philosophy

This project operates on a **Balanced Scoring Framework**. Evaluators and AI models integrating this skill base their assessments strictly on documented evidence.
The system:

- **Rewards direct experience:** Gives higher scores to candidates who clearly meet JD requirements with demonstrable evidence.
- **Recognizes transferable skills:** Evaluates underlying competencies and assigns partial credit contextually.
- **Flags critical gaps:** Identifies missing "Must-Have" requirements clearly.
- **Avoids over-penalizing non-linear paths:** Focuses strictly on capabilities rather than arbitrary career trajectories.
- **Separates evidence from inference:** Bases all scores off of documented evidence within the resume rather than AI speculation.

---

## Project Architecture

The core of the evaluation intelligence is managed via the `skills.md` prompt definition. This skill acts as the system prompt or governing directive for any Large Language Model (LLM) integrated into the ATS.

- **`skills.md`**: The master directive file. It contains the exact scoring weights, classification logic, and behavioral constraints for the AI evaluator. All updates to the evaluation logic should be committed here.
- **Input Payload**: A combination of the parsed Candidate Resume (text) and the Job Description (text/requirements).
- **Execution Engine**: Your chosen LLM or AI processing pipeline.
- **Output**: A strictly formatted JSON evaluation object (see [Expected Output Schema](#expected-output-schema)).

---

## Evaluation Framework

The system dynamically categorizes roles based on the Job Description into one of four distinct archetypes to apply the correct weighting scheme:

### 1. Technical Roles

(e.g., Software Engineering, DevOps, System Architecture)

- **30%** - Core Technical Skills
- **20%** - Architecture / System Exposure
- **15%** - Scale & Complexity
- **15%** - Problem Solving Evidence
- **10%** - Tooling & Stack Alignment
- **10%** - Domain Familiarity

### 2. Functional Roles

(e.g., Product Management, Sales, HR, Operations)

- **30%** - Core Role Competency
- **25%** - Quantified Impact (KPIs) / Contextual Evidence
- **15%** - Stakeholder Management
- **15%** - Strategic Contribution
- **10%** - Leadership Scope
- **5%** - Industry Familiarity

### 3. Hybrid Roles

(Blend of Technical and Functional requirements, e.g., Technical Product Manager, Presales Engineer)

- Applies a blended 50/50 weighting split between Technical and Functional criteria to ensure balanced evaluation without hallucination.

### 4. General Roles (Fallback)

If a role does not distinctly fit Technical or Functional profiles, the system defaults to the Functional role weighting scheme safely.

### Scoring Scale & Thresholds

Each specific requirement in the Job Description is scored from 0 to 5 based on verifiable evidence.

- `>= 4.5` → **Strong Proceed**
- `>= 3.5 and < 4.5` → **Proceed**
- `>= 2.5 and < 3.5` → **Consider with Caution**
- `< 2.5` → **Do Not Proceed**

---

## Bias Mitigation & Compliance

The system enforces strict guidelines to prevent systemic hiring biases.

**Prohibited Behaviors:**

- **Zero Demographic Inference:** The AI explicitly ignores Name, Gender, Age, Graduation Year, Nationality, Ethnicity, Visa Assumptions, and Personal Interests.
- **Employment Gaps:** The system is explicitly instructed to **never evaluate, penalize, or factor in employment gaps under any circumstances**.
- **Objective Risk Flagging Only:** Risk flags are limited to missing mandatory certifications, missing legally required qualifications, or lack of required security clearances. Tenure (e.g., job hopping), career pathing choices, and educational prestige are strictly ignored.

---

## Getting Started (FastAPI Backend)

This project now includes a ready-to-run Python FastAPI backend that handles PDF parsing and LLM integration natively.

### Prerequisites

1. **Python 3.9+** installed on your system.
2. A **Google Gemini API Key** (You can get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)).

### Installation & Setup

1. **Clone the repository** and navigate to the project directory:

   ```bash
   cd d:/work/skills-demo
   ```

2. **Create and Activate a Virtual Environment:**
   This isolates the project dependencies from your global python system.

   _On Windows (PowerShell):_

   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

   _On Mac/Linux:_

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Rename the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace the placeholder with your actual Google Gemini API Key:
   ```env
   GEMINI_API_KEY=AIzaSyA....
   ```

---

## Running the API

Once your environment is set up and your virtual environment is activated, you can start the development server:

```bash
uvicorn main:app --reload
```

_Note: The `--reload` flag automatically restarts the server if you make changes to the code._

You will see output indicating the server is running on `http://localhost:8000` or `http://127.0.0.1:8000`.

---

## Interacting with the API

You have three primary ways to interact with the backend API:

### 1. Using the Interactive Swagger UI (Recommended for Testing)

FastAPI automatically generates a web interface to test your endpoints.

1. Open your browser and go to [http://localhost:8000/docs](http://localhost:8000/docs).
2. Click on the `POST /evaluate` endpoint block to expand it.
3. Click the **"Try it out"** button in the top right.
4. Paste your `job_description` text into the text field.
5. Click **"Add Item"** or **"Choose Files"** next to `resumes` and upload one or multiple PDF/TXT resumes.
6. Click **"Execute"**.
7. Scroll down to see the array of structured JSON responses!

### 2. Using Postman

If you prefer a desktop API client like Postman:

1. Create a new request in Postman and set the method to **POST**.
2. Set the URL to `http://localhost:8000/evaluate`.
3. Go to the **Body** tab and select **`form-data`**.
4. Add a key called `job_description`, set its type to **Text**, and paste your JD into the value.
5. Add multiple keys called `resumes` (plural), set their type to **File**, and upload your PDFs.
6. Click **Send**!

### 3. Using cURL (Command Line)

You can test batch processing directly from your terminal:

```bash
curl -X 'POST' \
  'http://localhost:8000/evaluate' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'job_description=Senior Software Engineer...' \
  -F 'resumes=@/path/to/resume1.pdf' \
  -F 'resumes=@/path/to/resume2.pdf'
```

---

## Expected Output Schema

The integration will return an **Array** of JSON objects.

```json
[
  {
    "Candidate_Source": "john_doe_resume.pdf",
    "Evaluation_Timestamp": "2026-03-02T12:00:00Z",
    "Overall_Score": 4.1,
  "Recommendation": "Proceed",
  "Confidence_Level": "High",
  "Role_Classification": "Technical",
  "Category_Breakdown": [
    { "Category_Name": "Core_Technical_Skills", "Weight": 0.3, "Score": 4.5 },
    {
      "Category_Name": "Architecture_System_Exposure",
      "Weight": 0.2,
      "Score": 4.0
    },
    { "Category_Name": "Scale_Complexity", "Weight": 0.15, "Score": 3.0 },
    {
      "Category_Name": "Problem_Solving_Evidence",
      "Weight": 0.15,
      "Score": 4.0
    },
    { "Category_Name": "Tooling_Stack_Alignment", "Weight": 0.1, "Score": 5.0 },
    { "Category_Name": "Domain_Familiarity", "Weight": 0.1, "Score": 4.0 }
  ],
  "Requirement_Mapping": [
    {
      "Requirement": "5+ years Python experience",
      "Type": "Must-Have",
      "Score": 5,
      "Evidence_Found": "7 years Python development at Company X"
    }
  ],
  "Strengths": ["Extensive experience in primary required languages"],
  "Gaps": ["Minimal exposure to highly concurrent systems"],
  "Risk_Flags": [],
  "Skill_Version": "1.0.1",
  "Framework_Version": "Balanced Scoring Framework"
}
```
