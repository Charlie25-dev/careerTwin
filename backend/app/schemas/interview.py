from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class InterviewCreate(BaseModel):
    resume_id: Optional[int] = None
    interview_type: str = "Resume-based"  # General HR, Technical, Behavioral, Resume-based, Project-based
    language: str = "en"  # en, hi, kn, te, ta
    difficulty: str = "Adaptive"  # Easy, Medium, Hard, Adaptive
    duration_minutes: int = 15

class CandidateAnswerSubmit(BaseModel):
    answer: str
    audio_duration_seconds: Optional[float] = None

class MessageEvaluation(BaseModel):
    score: float = Field(..., ge=0, le=10)
    relevance: float = Field(..., ge=0, le=10)
    clarity: float = Field(..., ge=0, le=10)
    technical_depth: float = Field(..., ge=0, le=10)
    feedback_snippet: str
    follow_up_reasoning: Optional[str] = None
    adapted_difficulty: Optional[str] = None

class InterviewMessageOut(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    topic: Optional[str] = None
    difficulty_level: Optional[str] = None
    evaluation: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ModelAnswerPair(BaseModel):
    question: str
    candidate_answer: str
    improved_model_answer: str
    key_improvement_tips: str

class DetailedFeedbackReport(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    answer_relevance: float = Field(..., ge=0, le=100)
    technical_understanding: float = Field(..., ge=0, le=100)
    communication_clarity: float = Field(..., ge=0, le=100)
    confidence_indicator: float = Field(..., ge=0, le=100)
    language_used: str
    language_label: str
    overall_observations: str
    strong_areas: List[str]
    weak_areas: List[str]
    recommended_improvements: List[str]
    suggested_topics_to_study: List[str]
    example_improved_answers: List[ModelAnswerPair]

class InterviewSessionOut(BaseModel):
    id: int
    user_id: int
    resume_id: Optional[int]
    interview_type: str
    language: str
    difficulty: str
    duration_minutes: int
    status: str
    overall_score: float
    feedback: Optional[Dict[str, Any]] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    messages: List[InterviewMessageOut] = []

    class Config:
        from_attributes = True

class InterviewNextQuestionResponse(BaseModel):
    session_id: int
    question: str
    question_number: int
    total_questions: int
    topic: str
    difficulty: str
    language: str
    evaluation_previous: Optional[Dict[str, Any]] = None
    is_completed: bool = False
    avatar_state: str = "Speaking"
