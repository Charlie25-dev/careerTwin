from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.user import User
from app.models.interview import InterviewSession, InterviewMessage
from app.schemas.interview import (
    InterviewCreate, CandidateAnswerSubmit, InterviewSessionOut,
    InterviewNextQuestionResponse, DetailedFeedbackReport
)
from app.auth.dependencies import get_current_user
from app.services.interview_service import InterviewEngine
from app.services.ai_service.demo_provider import LANGUAGE_META

router = APIRouter(prefix="/interview", tags=["Adaptive Multilingual Interview"])

@router.get("/languages")
def get_supported_languages():
    """Returns supported languages with native scripts and locale flags."""
    return [
        {"code": "en", "name": "English", "native": "English", "description": "Standard Technical & HR Interview in English"},
        {"code": "hi", "name": "Hindi", "native": "हिन्दी", "description": "व्यावसायिक और तकनीकी साक्षात्कार हिन्दी में"},
        {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "description": "ತಾಂತ್ರಿಕ ಮತ್ತು ಸಾಮಾನ್ಯ ಸಂದರ್ಶನ ಕನ್ನಡದಲ್ಲಿ"},
        {"code": "te", "name": "Telugu", "native": "తెలుగు", "description": "సాంకేతిక మరియు సాధారణ ఇంటర్వ్యూ తెలుగులో"},
        {"code": "ta", "name": "Tamil", "native": "தமிழ்", "description": "தொழில்நுட்ப மற்றும் பொது நேர்காணல் தமிழில்"}
    ]

@router.post("/create", response_model=InterviewNextQuestionResponse)
def create_interview(
    config: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        response = InterviewEngine.start_session(
            db=db,
            user_id=current_user.id,
            resume_id=config.resume_id,
            interview_type=config.interview_type,
            language=config.language,
            difficulty=config.difficulty,
            duration_minutes=config.duration_minutes
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate interview: {str(e)}")

@router.post("/{session_id}/answer", response_model=InterviewNextQuestionResponse)
def submit_answer(
    session_id: int,
    payload: CandidateAnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not payload.answer or not payload.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")

    try:
        result = InterviewEngine.process_answer(
            db=db,
            session_id=session_id,
            user_id=current_user.id,
            candidate_answer=payload.answer.strip(),
            audio_duration_seconds=payload.audio_duration_seconds
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate response: {str(e)}")

@router.post("/{session_id}/complete")
def complete_interview(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = InterviewEngine.complete_session(db, session_id, current_user.id)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete session: {str(e)}")

@router.get("/history", response_model=List[InterviewSessionOut])
def list_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).all()
    return sessions

@router.get("/{session_id}", response_model=InterviewSessionOut)
def get_interview_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session

@router.get("/{session_id}/results")
def get_interview_results(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    
    if session.status != "completed" or not session.feedback:
        # If not concluded yet, complete it now to generate results
        InterviewEngine.complete_session(db, session_id, current_user.id)
        db.refresh(session)

    return {
        "session_id": session.id,
        "interview_type": session.interview_type,
        "language": session.language,
        "difficulty": session.difficulty,
        "overall_score": session.overall_score,
        "feedback": session.feedback,
        "created_at": session.created_at,
        "completed_at": session.completed_at
    }
