from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=False)  # pdf, docx, txt
    raw_text = Column(Text, nullable=False)
    
    # Structured extracted data from resume:
    # { name, email, phone, education, skills, projects, experience, certifications, achievements, career_interests }
    parsed_data = Column(JSON, nullable=True)
    
    # Comprehensive AI analysis:
    # { overview, strengths, improvements, skills_identified, missing_skills,
    #   project_analysis, experience_analysis, structure_analysis, ats_observations, recommendations }
    analysis = Column(JSON, nullable=True)
    
    ats_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="resumes")
    interviews = relationship("InterviewSession", back_populates="resume")
