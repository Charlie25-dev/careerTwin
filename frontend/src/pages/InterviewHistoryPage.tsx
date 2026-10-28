import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { InterviewSession } from '../types';
import { History, Award, Calendar, Video, ArrowRight, Languages } from 'lucide-react';

interface InterviewHistoryPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const InterviewHistoryPage: React.FC<InterviewHistoryPageProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.getInterviewHistory();
        setSessions(history);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            <span>Past Interview Sessions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review your mock interview transcripts, scores, and improvement reports</p>
        </div>

        <button
          onClick={() => onNavigate('interview-setup')}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all"
        >
          <Video className="w-3.5 h-3.5" />
          <span>New Interview</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading interview records...</div>
      ) : sessions.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Mock Sessions Recorded</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Take your first AI-evaluated interview in English, Hindi, Kannada, Telugu, or Tamil to start tracking improvement.
          </p>
          <button
            onClick={() => onNavigate('interview-setup')}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all"
          >
            Start Mock Interview
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onNavigate('interview-results', { session_id: session.id })}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{session.interview_type} Interview</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono border border-slate-700">
                    {session.difficulty}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono uppercase">
                    Lang: {session.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Conducted on {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Overall Score</p>
                  <p className="text-xl font-extrabold text-emerald-400 font-mono">
                    {session.overall_score ? `${session.overall_score}%` : 'Concluded'}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 group-hover:text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
