import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Resume, LanguageCode } from '../types';
import { LanguageSelector } from '../components/LanguageSelector';
import { 
  Video, Sparkles, Sliders, Clock, Target, 
  ArrowRight, ShieldCheck, Zap, RefreshCw, FileText
} from 'lucide-react';

interface InterviewSetupPageProps {
  initialResumeId?: number;
  onNavigate: (view: string, data?: any) => void;
}

export const InterviewSetupPage: React.FC<InterviewSetupPageProps> = ({ 
  initialResumeId, 
  onNavigate 
}) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | undefined>(initialResumeId);
  const [interviewType, setInterviewType] = useState('Resume-based');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [duration, setDuration] = useState(15);
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const list = await api.getResumes();
        setResumes(list);
        if (list.length > 0 && !selectedResumeId) {
          setSelectedResumeId(list[0].id);
        }
      } catch (err) {
        console.warn('Could not fetch resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, [initialResumeId]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const sessionResponse = await api.createInterview({
        resume_id: selectedResumeId,
        interview_type: interviewType,
        language: language,
        difficulty: difficulty,
        duration_minutes: duration
      });

      onNavigate('interview-room', {
        sessionResponse,
        sessionConfig: {
          resume_id: selectedResumeId,
          interview_type: interviewType,
          language: language,
          difficulty: difficulty,
          duration_minutes: duration
        }
      });
    } catch (err: any) {
      alert(err.message || 'Failed to start interview session.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleQuickDemoLoad = async (type: 'software_engineer' | 'iot_engineer') => {
    try {
      const res = await api.loadSampleResume(type);
      setResumes([res, ...resumes]);
      setSelectedResumeId(res.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
          Personalized AI Interview Session
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-3">Interview Setup & Language Selection</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Configure your mock interview parameters. The AI interviewer will tailor technical follow-ups to your resume and converse natively in your selected language.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8">
        
        {/* Prominent Language Selection UI */}
        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={setLanguage}
        />

        <div className="border-t border-slate-800 pt-6 space-y-6">
          
          {/* Resume Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Base Interview On Resume:</span>
              </label>

              {resumes.length === 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLoad('software_engineer')}
                    className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Zap className="w-3 h-3 fill-amber-400" /> Use Aarav SWE Resume
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLoad('iot_engineer')}
                    className="text-xs text-emerald-300 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Zap className="w-3 h-3 fill-emerald-400" /> Use Priya IoT Resume
                  </button>
                </div>
              )}
            </div>

            {resumes.length > 0 ? (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename} ({r.parsed_data?.candidate_name || 'Candidate'}) — ATS Score: {r.ats_score}%
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>No uploaded resume found. Interview will use candidate software engineering defaults or 1-click samples above.</span>
                <button
                  type="button"
                  onClick={() => onNavigate('resume-upload')}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
                >
                  Upload now
                </button>
              </div>
            )}
          </div>

          {/* Interview Type Selection */}
          <div>
            <label className="text-sm font-semibold text-white block mb-2">
              Interview Focus Area:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'Resume-based', label: 'Resume-based', desc: 'Questions on your projects & skills' },
                { id: 'Project-based', label: 'Project Deep Dive', desc: 'Architecture, MQ135/WebSockets tradeoffs' },
                { id: 'Technical', label: 'Core Technical', desc: 'Data structures, coding logic, APIs' },
                { id: 'Behavioral', label: 'Behavioral & STAR', desc: 'Teamwork, conflict, deadlines' },
                { id: 'General HR', label: 'General HR', desc: 'Strengths, career goals, culture fit' },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setInterviewType(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    interviewType === t.id
                      ? 'bg-brand-600/20 border-brand-500 text-white ring-1 ring-brand-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Difficulty */}
            <div>
              <label className="text-sm font-semibold text-white block mb-2">
                Adaptive Difficulty:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Adaptive', 'Medium', 'Hard', 'Easy'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      difficulty === d
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d === 'Adaptive' ? '⚡ Adaptive (AI Auto)' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-semibold text-white block mb-2">
                Interview Length:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      duration === mins
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins} Mins (5 Qs)
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Real-time voice synthesis and microphone analysis ready</span>
          </div>

          <button
            onClick={handleStart}
            disabled={isStarting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 font-extrabold text-sm text-white shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02] flex items-center space-x-2"
          >
            {isStarting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Initializing AI Interviewer...</span>
              </>
            ) : (
              <>
                <span>Enter Interview Room</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
