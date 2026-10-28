from sqlalchemy.orm import Session
from app.models.user import User
from app.models.resume import Resume
from app.auth.jwt_handler import get_password_hash
from app.services.resume_service import SAMPLE_RESUMES, ResumeAnalyzer

def seed_demo_data_if_needed(db: Session):
    """
    Seeds a friendly demo user and pre-analyzed sample resumes so that
    testers, evaluators, and hackathon judges can immediately test the entire
    end-to-end flow with 1 click without needing to create an account or prepare a PDF!
    """
    demo_email = "demo@careercoach.ai"
    existing = db.query(User).filter(User.email == demo_email).first()
    if not existing:
        user = User(
            email=demo_email,
            hashed_password=get_password_hash("DemoPass123!"),
            full_name="Alex Rivera",
            target_role="Software Engineer Intern",
            preferred_language="en"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Pre-seed software engineer resume
        sample_swe = SAMPLE_RESUMES["software_engineer"]
        analysis_swe = ResumeAnalyzer.analyze(sample_swe["raw_text"], target_role="Software Engineer Intern")
        resume_swe = Resume(
            user_id=user.id,
            filename="Aarav_Sharma_SWE_Resume.pdf",
            file_type="pdf",
            raw_text=sample_swe["raw_text"],
            parsed_data=sample_swe,
            analysis=analysis_swe,
            ats_score=analysis_swe.get("ats_score", 84.0)
        )
        db.add(resume_swe)

        # Pre-seed IoT engineer resume
        sample_iot = SAMPLE_RESUMES["iot_engineer"]
        analysis_iot = ResumeAnalyzer.analyze(sample_iot["raw_text"], target_role="IoT Systems Intern")
        resume_iot = Resume(
            user_id=user.id,
            filename="Priya_Nair_IoT_Resume.pdf",
            file_type="pdf",
            raw_text=sample_iot["raw_text"],
            parsed_data=sample_iot,
            analysis=analysis_iot,
            ats_score=analysis_iot.get("ats_score", 88.0)
        )
        db.add(resume_iot)

        db.commit()
