import { 
  AuthResponse, User, Resume, InterviewSession, NextQuestionResponse,
  DetailedFeedbackReport, LanguageInfo 
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('careercoach_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('careercoach_token', token);
    } else {
      localStorage.removeItem('careercoach_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('careercoach_token');
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async fetchSafe(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (err: any) {
      throw new Error('Backend connection failed. Please ensure the Python server (uvicorn) is running at http://127.0.0.1:8000');
    }
  }

  // Auth APIs
  async register(data: { email: string; password: string; full_name: string; target_role?: string; preferred_language?: string }): Promise<AuthResponse> {
    const res = await this.fetchSafe(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    const result: AuthResponse = await res.json();
    this.setToken(result.access_token);
    return result;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.fetchSafe(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Invalid credentials');
    }
    const result: AuthResponse = await res.json();
    this.setToken(result.access_token);
    return result;
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.fetchSafe(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await this.fetchSafe(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  async deleteAccount(): Promise<{ message: string }> {
    const res = await this.fetchSafe(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete account');
    this.setToken(null);
    return res.json();
  }

  // Resume APIs
  async uploadResume(file: File, targetRole = 'Software Engineer Intern'): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);

    const res = await this.fetchSafe(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to upload resume' }));
      throw new Error(err.detail || 'Failed to upload resume');
    }
    const data = await res.json();
    return data.resume;
  }

  async loadSampleResume(sampleType: 'software_engineer' | 'iot_engineer'): Promise<Resume> {
    const res = await this.fetchSafe(`${API_BASE_URL}/resume/sample/${sampleType}/load`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load sample resume');
    const data = await res.json();
    return data.resume;
  }

  async getLatestResume(): Promise<Resume | null> {
    const res = await this.fetchSafe(`${API_BASE_URL}/resume/latest`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  }

  async getResumes(): Promise<Resume[]> {
    const res = await this.fetchSafe(`${API_BASE_URL}/resume`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  }

  async getResume(id: number): Promise<Resume> {
    const res = await this.fetchSafe(`${API_BASE_URL}/resume/${id}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Resume not found');
    return res.json();
  }

  async deleteResume(id: number): Promise<void> {
    await this.fetchSafe(`${API_BASE_URL}/resume/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
  }

  // Interview APIs
  async getSupportedLanguages(): Promise<LanguageInfo[]> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/languages`);
    if (!res.ok) throw new Error('Failed to load languages');
    return res.json();
  }

  async createInterview(config: {
    resume_id?: number;
    interview_type: string;
    language: string;
    difficulty: string;
    duration_minutes: number;
  }): Promise<NextQuestionResponse> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(config)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create interview' }));
      throw new Error(err.detail || 'Failed to create interview');
    }
    return res.json();
  }

  async submitAnswer(sessionId: number, answer: string, audioDuration?: number): Promise<NextQuestionResponse> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answer, audio_duration_seconds: audioDuration })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit answer' }));
      throw new Error(err.detail || 'Failed to submit answer');
    }
    return res.json();
  }

  async completeInterview(sessionId: number): Promise<{ session_id: number; is_completed: boolean; feedback: DetailedFeedbackReport }> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/${sessionId}/complete`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to complete interview' }));
      throw new Error(err.detail || 'Failed to complete interview');
    }
    return res.json();
  }

  async getInterviewResults(sessionId: number): Promise<any> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/${sessionId}/results`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to load interview results' }));
      throw new Error(err.detail || 'Failed to load interview results');
    }
    return res.json();
  }

  async getInterviewHistory(): Promise<InterviewSession[]> {
    const res = await this.fetchSafe(`${API_BASE_URL}/interview/history`, {
      headers: this.getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  }
}

export const api = new ApiService();
