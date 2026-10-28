from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProjectItem(BaseModel):
    name: str
    description: str
    technologies: List[str] = []
    highlights: List[str] = []

class ExperienceItem(BaseModel):
    title: str
    organization: str
    duration: Optional[str] = None
    description: Optional[str] = None
    bullet_points: List[str] = []

class EducationItem(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    graduation_year: Optional[str] = None
    score: Optional[str] = None

class ParsedResumeData(BaseModel):
    candidate_name: str = "Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    career_interests: List[str] = []
    technologies: List[str] = []
    skills: List[str] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    experience: List[ExperienceItem] = []
    certifications: List[str] = []
    achievements: List[str] = []

class ResumeAnalysis(BaseModel):
    overview: str
    ats_score: float = Field(..., ge=0, le=100)
    strengths: List[str] = []
    improvement_areas: List[str] = []
    skills_identified: List[str] = []
    recommended_skills: List[str] = []
    project_analysis: List[Dict[str, Any]] = []
    experience_analysis: List[Dict[str, Any]] = []
    structure_analysis: Dict[str, Any] = {}
    ats_observations: List[str] = []
    actionable_recommendations: List[str] = []

class ResumeOut(BaseModel):
    id: int
    user_id: int
    filename: str
    file_type: str
    parsed_data: Optional[Dict[str, Any]] = None
    analysis: Optional[Dict[str, Any]] = None
    ats_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    message: str
    resume: ResumeOut
