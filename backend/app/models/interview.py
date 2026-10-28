from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    interview_type = Column(String, default="Resume-based")  # HR, Technical, Behavioral, Resume-based, Project-based
    language = Column(String, default="en")  # en, hi, kn, te, ta
    difficulty = Column(String, default="Medium")  # Easy, Medium, Hard, Adaptive
    duration_minutes = Column(Integer, default=15)
    status = Column(String, default="in_progress")  # in_progress, completed, cancelled
    overall_score = Column(Float, default=0.0)
    
    # Detailed final evaluation report
    feedback = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="interviews")
    resume = relationship("Resume", back_populates="interviews")
    messages = relationship("InterviewMessage", back_populates="session", cascade="all, delete-orphan", order_by="InterviewMessage.id")


class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # interviewer, candidate, system
    content = Column(Text, nullable=False)
    topic = Column(String, nullable=True)
    difficulty_level = Column(String, nullable=True)
    
    # Live evaluation of candidate's response
    # { score, relevance, clarity, technical_depth, feedback, follow_up_trigger }
    evaluation = Column(JSON, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("InterviewSession", back_populates="messages")
