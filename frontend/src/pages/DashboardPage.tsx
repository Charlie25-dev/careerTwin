import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Resume, InterviewSession } from '../types';
import { 
  FileText, Video, Sparkles, TrendingUp, CheckCircle, 
  AlertTriangle, ArrowRight, Upload, Calendar, Award, 
  Languages, ChevronRight, Zap
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [res, pastInterviews] = await Promise.all([
          api.getLatestResume(),
          api.getInterviewHistory()
        ]);
        setLatestResume(res);
        setInterviews(pastInterviews);
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickLoadDemo = async (type: 'software_engineer' | 'iot_engineer') => {
    try {
      const res = await api.loadSampleResume(type);
      setLatestResume(res);
      onNavigate('resume-analysis', res);
    } catch (e) {
      console.error(e);
    }
  };

  const avgInterviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / interviews.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="glass-card-active rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Targeting: <span className="font-semibold text-white">{user?.target_role || 'Software Engineer Intern'}</span>. Prepare with targeted resume insights and AI multilingual voice interviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('resume-upload')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sm font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>{latestResume ? 'Update Resume' : 'Upload Resume'}</span>
          </button>

          <button
            onClick={() => onNavigate('interview-setup')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
          >
            <Video className="w-4 h-4" />
            <span>Start AI Interview</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Resume Status</p>
            <h3 className="text-xl font-bold text-white mt-1">
              {latestResume ? 'Active & Analyzed' : 'No Resume'}
            </h3>
            <span className="text-[11px] text-purple-400 font-medium">
              {latestResume ? latestResume.filename : 'Upload to start'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">ATS Readiness Indicator</p>
            <h3 className="text-xl font-bold text-emerald-400 mt-1">
              {latestResume ? `${latestResume.ats_score}%` : 'N/A'}
            </h3>
            <span className="text-[11px] text-slate-400">
              Potential improvement indicator
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Mock Sessions Taken</p>
            <h3 className="text-xl font-bold text-white mt-1">
              {interviews.length}
            </h3>
            <span className="text-[11px] text-cyan-400">
              Avg score: {avgInterviewScore > 0 ? `${avgInterviewScore}/100` : 'None yet'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Multilingual Dialects</p>
            <h3 className="text-xl font-bold text-white mt-1">
              5 Languages
            </h3>
            <span className="text-[11px] text-indigo-400">
              EN • HI • KN • TE • TA
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Languages className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

      </div>

      {/* Main Grid: Latest Resume Highlights & Interview History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Resume Overview & Strengths */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-white">Latest Resume Analysis</h3>
              </div>

              {latestResume && (
                <button
                  onClick={() => onNavigate('resume-analysis', latestResume)}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
                >
                  <span>View Full Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {latestResume ? (
              <div className="space-y-5">
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  {latestResume.analysis?.overview || 'Resume analysis generated.'}
                </p>

                {/* Strengths & Improvements Quick Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Top Strengths
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {(latestResume.analysis?.strengths || []).slice(0, 3).map((st, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Recommended Improvements
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {(latestResume.analysis?.improvement_areas || []).slice(0, 3).map((ia, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{ia}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Skills Chips */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">Identified Core Skills:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(latestResume.analysis?.skills_identified || []).slice(0, 10).map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => onNavigate('interview-setup', { resume_id: latestResume.id })}
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md transition-all flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Practice Interview on this Resume</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No resume uploaded yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-5">
                  Upload your resume to get instant strengths, gaps, and personalized AI interview questions.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onNavigate('resume-upload')}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload PDF / DOCX</span>
                  </button>

                  <button
                    onClick={() => handleQuickLoadDemo('software_engineer')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Load Sample SWE Resume</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 col): Interview History */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Recent Mock Sessions</span>
              </h3>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onNavigate('interview-results', { session_id: session.id })}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {session.interview_type}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Lang: <span className="uppercase text-brand-300 font-mono">{session.language}</span> • {session.difficulty}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {session.overall_score ? `${session.overall_score}%` : 'Concluded'}
                      </span>
                      <p className="text-[10px] text-slate-500">View report</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No mock interviews completed yet.</p>
                <button
                  onClick={() => onNavigate('interview-setup')}
                  className="mt-3 text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  Start your first mock interview →
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Resumes Box */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> 1-Click Sample Resumes
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Instantly test the platform with realistic student capstone projects:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLoadDemo('software_engineer')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Aarav Sharma (Full-Stack SWE)</span>
                <span className="text-[10px] text-slate-500 font-mono">React/Node</span>
              </button>
              <button
                onClick={() => handleQuickLoadDemo('iot_engineer')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Priya Nair (IoT MQ135 Air Quality)</span>
                <span className="text-[10px] text-slate-500 font-mono">ESP32/C++</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
