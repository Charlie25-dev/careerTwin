export type LanguageCode = 'en' | 'hi' | 'kn' | 'te' | 'ta';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  native: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  preferred_language: LanguageCode;
  target_role?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface ExperienceItem {
  title: string;
  organization: string;
  duration?: string;
  description?: string;
  bullet_points: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field_of_study?: string;
  graduation_year?: string;
  score?: string;
}

export interface ParsedResumeData {
  candidate_name: string;
  email?: string;
  phone?: string;
  career_interests: string[];
  technologies: string[];
  skills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: string[];
  achievements: string[];
  raw_text?: string;
}

export interface ResumeAnalysis {
  overview: string;
  ats_score: number;
  strengths: string[];
  improvement_areas: string[];
  skills_identified: string[];
  recommended_skills: string[];
  project_analysis: Array<{
    title: string;
    assessment: string;
    recommendation: string;
  }>;
  experience_analysis: Array<{
    status: string;
    observation: string;
    suggestion: string;
  }>;
  structure_analysis: {
    length?: string;
    readability?: string;
    contact_info_present?: boolean;
    sections_detected?: string[];
  };
  ats_observations: string[];
  actionable_recommendations: string[];
}

export interface Resume {
  id: number;
  user_id: number;
  filename: string;
  file_type: string;
  parsed_data: ParsedResumeData;
  analysis: ResumeAnalysis;
  ats_score: number;
  created_at: string;
  updated_at: string;
}

export interface MessageEvaluation {
  score: number;
  relevance: number;
  clarity: number;
  technical_depth: number;
  feedback_snippet: string;
  follow_up_reasoning?: string;
  adapted_difficulty?: string;
}

export interface InterviewMessage {
  id: number;
  session_id: number;
  role: 'interviewer' | 'candidate' | 'system';
  content: string;
  topic?: string;
  difficulty_level?: string;
  evaluation?: MessageEvaluation;
  timestamp: string;
}

export interface ModelAnswerPair {
  question: string;
  candidate_answer: string;
  improved_model_answer: string;
  key_improvement_tips: string;
}

export interface DetailedFeedbackReport {
  overall_score: number;
  answer_relevance: number;
  technical_understanding: number;
  communication_clarity: number;
  confidence_indicator: number;
  language_used: string;
  language_label: string;
  overall_observations: string;
  strong_areas: string[];
  weak_areas: string[];
  recommended_improvements: string[];
  suggested_topics_to_study: string[];
  example_improved_answers: ModelAnswerPair[];
}

export interface InterviewSession {
  id: number;
  user_id: number;
  resume_id?: number;
  interview_type: string;
  language: LanguageCode;
  difficulty: string;
  duration_minutes: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  overall_score: number;
  feedback?: DetailedFeedbackReport;
  created_at: string;
  completed_at?: string;
  messages: InterviewMessage[];
}

export interface NextQuestionResponse {
  session_id: number;
  question: string;
  question_number: number;
  total_questions: number;
  topic: string;
  difficulty: string;
  language: LanguageCode;
  evaluation_previous?: MessageEvaluation;
  is_completed: boolean;
  avatar_state: 'Speaking' | 'Listening' | 'Thinking' | 'Idle';
}
