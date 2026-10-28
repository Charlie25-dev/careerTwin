from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIService(ABC):
    @abstractmethod
    def analyze_resume(self, raw_text: str, target_role: str = "Software Engineer Intern") -> Dict[str, Any]:
        """Analyzes parsed resume text and returns structured strengths, gaps, ATS observations and score."""
        pass

    @abstractmethod
    def generate_first_question(
        self,
        resume_data: Dict[str, Any],
        interview_type: str,
        language: str,
        difficulty: str
    ) -> Dict[str, Any]:
        """Generates the opening interview question tailored to the candidate's resume and chosen language."""
        pass

    @abstractmethod
    def evaluate_answer_and_followup(
        self,
        resume_data: Dict[str, Any],
        previous_question: str,
        candidate_answer: str,
        history: List[Dict[str, Any]],
        interview_type: str,
        language: str,
        difficulty: str,
        question_count: int,
        max_questions: int = 5
    ) -> Dict[str, Any]:
        """Evaluates candidate response and produces adaptive follow-up or next topic in the selected language."""
        pass

    @abstractmethod
    def generate_interview_feedback(
        self,
        resume_data: Dict[str, Any],
        session_info: Dict[str, Any],
        messages: List[Dict[str, Any]],
        language: str
    ) -> Dict[str, Any]:
        """Produces a comprehensive multi-metric feedback report with actionable suggestions and model answers."""
        pass
