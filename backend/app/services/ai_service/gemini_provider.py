import json
import logging
from typing import Dict, Any, List
from .base import BaseAIService
from .demo_provider import DemoAIService
from app.config.settings import settings

logger = logging.getLogger(__name__)

class GeminiAIService(BaseAIService):
    """
    Production-ready Gemini API implementation with seamless fallback to DemoAIService.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.AI_API_KEY
        self.fallback = DemoAIService()
        self.client = None
        
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize google-genai client: {e}")

    def analyze_resume(self, raw_text: str, target_role: str = "Software Engineer Intern") -> Dict[str, Any]:
        if not self.client:
            return self.fallback.analyze_resume(raw_text, target_role)
            
        prompt = f"""
You are an expert technical recruiter and resume reviewer evaluating an entry-level candidate / student for the role of: {target_role}.
Analyze this resume text:
\"\"\"
{raw_text[:4000]}
\"\"\"

Return ONLY valid JSON matching this schema:
{{
  "overview": "2-3 sentence professional summary",
  "ats_score": float between 50 and 95,
  "strengths": ["3-5 clear strengths"],
  "improvement_areas": ["3-5 actionable areas for improvement"],
  "skills_identified": ["list of skills found in text"],
  "recommended_skills": ["list of 4-6 recommended skills for target role"],
  "project_analysis": [{{"title": "project name", "assessment": "evaluation", "recommendation": "improvement"}}],
  "experience_analysis": [{{"status": "summary", "observation": "notes", "suggestion": "tip"}}],
  "structure_analysis": {{"length": "assessment", "readability": "High/Medium", "contact_info_present": true}},
  "ats_observations": ["Potential ATS improvement areas - do not guarantee passing ATS"],
  "actionable_recommendations": ["4 bullet recommendations"]
}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return data
        except Exception as e:
            logger.warning(f"Gemini API resume analysis failed ({e}), falling back to Demo provider.")
            return self.fallback.analyze_resume(raw_text, target_role)

    def generate_first_question(
        self,
        resume_data: Dict[str, Any],
        interview_type: str,
        language: str,
        difficulty: str
    ) -> Dict[str, Any]:
        if not self.client:
            return self.fallback.generate_first_question(resume_data, interview_type, language, difficulty)

        prompt = f"""
You are a warm, professional senior interviewer conducting a {interview_type} mock interview in language code '{language}'.
Candidate Resume Summary:
{json.dumps(resume_data)[:2000]}

Generate the opening question in '{language}'.
Return ONLY JSON:
{{
  "question": "question text in {language}",
  "question_number": 1,
  "total_questions": 5,
  "topic": "topic name",
  "difficulty": "{difficulty}",
  "language": "{language}",
  "avatar_state": "Speaking",
  "is_completed": false
}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Gemini API first question generation failed ({e}), falling back to Demo provider.")
            return self.fallback.generate_first_question(resume_data, interview_type, language, difficulty)

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
        if not self.client:
            return self.fallback.evaluate_answer_and_followup(
                resume_data, previous_question, candidate_answer, history,
                interview_type, language, difficulty, question_count, max_questions
            )

        if question_count >= max_questions:
            return self.fallback.evaluate_answer_and_followup(
                resume_data, previous_question, candidate_answer, history,
                interview_type, language, difficulty, question_count, max_questions
            )

        prompt = f"""
You are an adaptive technical interviewer.
Interview Language: {language}
Previous Question: {previous_question}
Candidate Answer: {candidate_answer}
Question Count: {question_count} of {max_questions}

Evaluate the candidate's answer and generate an intelligent follow-up question in '{language}'.
If candidate's answer was strong, probe deeper into tradeoffs. If shallow, ask for clarification.
Return ONLY JSON:
{{
  "evaluation": {{
    "score": float 0-10,
    "relevance": float 0-10,
    "clarity": float 0-10,
    "technical_depth": float 0-10,
    "feedback_snippet": "short feedback",
    "follow_up_reasoning": "why this follow-up was chosen",
    "adapted_difficulty": "Easy/Medium/Hard"
  }},
  "next_question": "next question in {language}",
  "question_number": {question_count + 1},
  "total_questions": {max_questions},
  "topic": "topic name",
  "difficulty": "{difficulty}",
  "language": "{language}",
  "is_completed": false,
  "avatar_state": "Speaking"
}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Gemini API follow-up failed ({e}), using Demo fallback.")
            return self.fallback.evaluate_answer_and_followup(
                resume_data, previous_question, candidate_answer, history,
                interview_type, language, difficulty, question_count, max_questions
            )

    def generate_interview_feedback(
        self,
        resume_data: Dict[str, Any],
        session_info: Dict[str, Any],
        messages: List[Dict[str, Any]],
        language: str
    ) -> Dict[str, Any]:
        # Always use robust multi-point synthesizer with model answers
        return self.fallback.generate_interview_feedback(resume_data, session_info, messages, language)
