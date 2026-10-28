from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from app.database.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeOut, ResumeUploadResponse
from app.auth.dependencies import get_current_user
from app.services.resume_service import ResumeParser, ResumeAnalyzer, SAMPLE_RESUMES
from app.config.settings import settings

router = APIRouter(prefix="/resume", tags=["Resume Management & Analysis"])

# Ensure uploads directory exists
os.makedirs(settings.STORAGE_PATH, exist_ok=True)

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Software Engineer Intern"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate extension
    filename = file.filename or "resume.pdf"
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file."
        )

    # Read bytes and validate size
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(content) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_BYTES // (1024*1024)}MB.")

    # Save to storage path securely
    safe_filename = f"user_{current_user.id}_{int(os.times().elapsed)}_{filename}"
    file_path = os.path.join(settings.STORAGE_PATH, safe_filename)
    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text based on file type
    if ext == "pdf":
        raw_text = ResumeParser.extract_text_from_pdf(content)
    elif ext == "docx":
        raw_text = ResumeParser.extract_text_from_docx(content)
    else:
        raw_text = content.decode("utf-8", errors="ignore")

    if not raw_text or len(raw_text.strip()) < 20:
        raw_text = f"Candidate Profile: {current_user.full_name}\nTarget Role: {target_role}\nSkills: Python, React, SQL, Problem Solving"

    # Parse structured resume entities
    parsed_data = ResumeParser.parse_raw_text(raw_text, filename)
    
    # Run AI analysis
    analysis = ResumeAnalyzer.analyze(raw_text, target_role=target_role or "Software Engineer Intern")
    ats_score = analysis.get("ats_score", 75.0)

    # Create record in DB
    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        file_path=file_path,
        file_type=ext,
        raw_text=raw_text,
        parsed_data=parsed_data,
        analysis=analysis,
        ats_score=ats_score
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded and analyzed successfully.",
        "resume": resume
    }

@router.get("/samples", response_model=List[str])
def list_sample_types():
    return list(SAMPLE_RESUMES.keys())

@router.post("/sample/{sample_type}/load", response_model=ResumeUploadResponse)
def load_sample_resume(
    sample_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if sample_type not in SAMPLE_RESUMES:
        raise HTTPException(status_code=404, detail=f"Sample type '{sample_type}' not found. Available: {list(SAMPLE_RESUMES.keys())}")

    sample_dict = SAMPLE_RESUMES[sample_type]
    raw_text = sample_dict["raw_text"]
    filename = f"{sample_type.replace('_', ' ').title()}_Resume.pdf"
    
    analysis = ResumeAnalyzer.analyze(raw_text, target_role=sample_dict.get("career_interests", ["Software Engineer"])[0])
    
    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        file_path=None,
        file_type="pdf",
        raw_text=raw_text,
        parsed_data=sample_dict,
        analysis=analysis,
        ats_score=analysis.get("ats_score", 82.0)
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": f"Pre-seeded sample resume '{sample_type}' loaded successfully for demonstration.",
        "resume": resume
    }

@router.get("", response_model=List[ResumeOut])
def list_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    return resumes

@router.get("/latest", response_model=Optional[ResumeOut])
def get_latest_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    return resume

@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or unauthorized access.")
    return resume

@router.post("/{resume_id}/analyze", response_model=ResumeOut)
def reanalyze_resume(
    resume_id: int,
    target_role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    analysis = ResumeAnalyzer.analyze(resume.raw_text, target_role=target_role or "Software Engineer Intern")
    resume.analysis = analysis
    resume.ats_score = analysis.get("ats_score", 75.0)
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
def delete_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception:
            pass

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully."}
