from typing import Dict, Any
from app.services.ai_service import get_ai_service

class ResumeAnalyzer:
    @staticmethod
    def analyze(raw_text: str, target_role: str = "Software Engineer Intern") -> Dict[str, Any]:
        ai_service = get_ai_service()
        return ai_service.analyze_resume(raw_text=raw_text, target_role=target_role)
