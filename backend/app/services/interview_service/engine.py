from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.interview import InterviewSession, InterviewMessage
from app.models.resume import Resume
from app.services.ai_service import get_ai_service
from app.services.resume_service.parser import SAMPLE_RESUMES

class InterviewEngine:
    @staticmethod
    def start_session(
        db: Session,
        user_id: int,
        resume_id: Optional[int],
        interview_type: str,
        language: str,
        difficulty: str,
        duration_minutes: int
    ) -> Dict[str, Any]:
        ai_service = get_ai_service()

        # Load resume data
        resume_data = {}
        if resume_id:
            resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
            if resume and resume.parsed_data:
                resume_data = resume.parsed_data
        
        if not resume_data:
            # Fallback to rich default profile if no resume uploaded yet
            resume_data = SAMPLE_RESUMES["software_engineer"]

        # Create session record
        session = InterviewSession(
            user_id=user_id,
            resume_id=resume_id,
            interview_type=interview_type,
            language=language,
            difficulty=difficulty,
            duration_minutes=duration_minutes,
            status="in_progress"
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Generate opening question
        first_q_data = ai_service.generate_first_question(
            resume_data=resume_data,
            interview_type=interview_type,
            language=language,
            difficulty=difficulty
        )

        # Store first interviewer message
        msg = InterviewMessage(
            session_id=session.id,
            role="interviewer",
            content=first_q_data["question"],
            topic=first_q_data["topic"],
            difficulty_level=difficulty
        )
        db.add(msg)
        db.commit()

        return {
            "session_id": session.id,
            "question": first_q_data["question"],
            "question_number": 1,
            "total_questions": first_q_data.get("total_questions", 5),
            "topic": first_q_data["topic"],
            "difficulty": difficulty,
            "language": language,
            "avatar_state": "Speaking",
            "is_completed": False
        }

    @staticmethod
    def process_answer(
        db: Session,
        session_id: int,
        user_id: int,
        candidate_answer: str,
        audio_duration_seconds: Optional[float] = None
    ) -> Dict[str, Any]:
        session = db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()

        if not session:
            raise ValueError("Interview session not found.")
        if session.status == "completed":
            return {"is_completed": True, "message": "Session is already concluded."}

        # Fetch messages history
        messages = db.query(InterviewMessage).filter(InterviewMessage.session_id == session.id).order_by(InterviewMessage.id.asc()).all()
        
        # Last interviewer question
        interviewer_msgs = [m for m in messages if m.role == "interviewer"]
        last_question = interviewer_msgs[-1].content if interviewer_msgs else "Tell me about yourself."

        # Load resume data
        resume_data = {}
        if session.resume_id:
            resume = db.query(Resume).filter(Resume.id == session.resume_id).first()
            if resume and resume.parsed_data:
                resume_data = resume.parsed_data
        if not resume_data:
            resume_data = SAMPLE_RESUMES["software_engineer"]

        history_payload = [{"role": m.role, "content": m.content} for m in messages]
        question_count = len(interviewer_msgs)

        ai_service = get_ai_service()
        eval_result = ai_service.evaluate_answer_and_followup(
            resume_data=resume_data,
            previous_question=last_question,
            candidate_answer=candidate_answer,
            history=history_payload,
            interview_type=session.interview_type,
            language=session.language,
            difficulty=session.difficulty,
            question_count=question_count,
            max_questions=5
        )

        # Store candidate answer message with evaluation
        candidate_msg = InterviewMessage(
            session_id=session.id,
            role="candidate",
            content=candidate_answer,
            topic=interviewer_msgs[-1].topic if interviewer_msgs else None,
            difficulty_level=session.difficulty,
            evaluation=eval_result.get("evaluation")
        )
        db.add(candidate_msg)
        db.commit()

        # Check if interview is completed
        if eval_result.get("is_completed"):
            return InterviewEngine.complete_session(db, session_id, user_id, final_msg_text=eval_result.get("next_question"))

        # Save next interviewer question
        next_q_text = eval_result.get("next_question")
        next_msg = InterviewMessage(
            session_id=session.id,
            role="interviewer",
            content=next_q_text,
            topic=eval_result.get("topic"),
            difficulty_level=eval_result.get("difficulty")
        )
        db.add(next_msg)
        
        # If difficulty adapted, update session
        if eval_result.get("evaluation", {}).get("adapted_difficulty"):
            session.difficulty = eval_result["evaluation"]["adapted_difficulty"]

        db.commit()

        return {
            "session_id": session.id,
            "question": next_q_text,
            "question_number": eval_result.get("question_number", question_count + 1),
            "total_questions": eval_result.get("total_questions", 5),
            "topic": eval_result.get("topic"),
            "difficulty": session.difficulty,
            "language": session.language,
            "evaluation_previous": eval_result.get("evaluation"),
            "is_completed": False,
            "avatar_state": "Speaking"
        }

    @staticmethod
    def complete_session(
        db: Session,
        session_id: int,
        user_id: int,
        final_msg_text: Optional[str] = None
    ) -> Dict[str, Any]:
        session = db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()

        if not session:
            raise ValueError("Interview session not found.")

        # Load all messages
        messages = db.query(InterviewMessage).filter(InterviewMessage.session_id == session.id).order_by(InterviewMessage.id.asc()).all()
        msg_payload = [
            {"role": m.role, "content": m.content, "evaluation": m.evaluation}
            for m in messages
        ]

        resume_data = {}
        if session.resume_id:
            resume = db.query(Resume).filter(Resume.id == session.resume_id).first()
            if resume and resume.parsed_data:
                resume_data = resume.parsed_data
        if not resume_data:
            resume_data = SAMPLE_RESUMES["software_engineer"]

        ai_service = get_ai_service()
        report = ai_service.generate_interview_feedback(
            resume_data=resume_data,
            session_info={
                "interview_type": session.interview_type,
                "difficulty": session.difficulty,
                "duration_minutes": session.duration_minutes
            },
            messages=msg_payload,
            language=session.language
        )

        session.status = "completed"
        session.completed_at = datetime.utcnow()
        session.overall_score = report.get("overall_score", 80.0)
        session.feedback = report
        db.commit()

        return {
            "session_id": session.id,
            "is_completed": True,
            "overall_score": session.overall_score,
            "feedback": report,
            "message": final_msg_text or "Interview completed successfully."
        }
