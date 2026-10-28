import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DetailedFeedbackReport } from '../types';
import { 
  Award, TrendingUp, CheckCircle, AlertTriangle, BookOpen, 
  Lightbulb, ArrowRight, Video, FileText, Share2, Sparkles, Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InterviewResultsPageProps {
  sessionId: number;
  onNavigate: (view: string, data?: any) => void;
}

export const InterviewResultsPage: React.FC<InterviewResultsPageProps> = ({ sessionId, onNavigate }) => {
  const [report, setReport] = useState<DetailedFeedbackReport | null>(null);
  const [sessionMeta, setSessionMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.getInterviewResults(sessionId);
        setReport(res.feedback);
        setSessionMeta(res);

        // Trigger celebratory confetti on high score
        if (res.feedback?.overall_score >= 70) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Error fetching interview results:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Synthesizing Detailed AI Evaluation Report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-400">Feedback report not found.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
            Performance Analysis Complete
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Interview Performance Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Language: <strong className="text-slate-200">{report.language_label}</strong> • Session #{sessionId}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('interview-setup')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-bold text-white shadow-lg transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Practice Another Interview</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Overall Score */}
        <div className="col-span-2 sm:col-span-1 glass-card-active rounded-2xl p-5 border border-indigo-500/40 text-center flex flex-col items-center justify-center">
          <Award className="w-6 h-6 text-brand-400 mb-1" />
          <span className="text-3xl font-extrabold text-white font-mono">{report.overall_score}%</span>
          <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mt-1">Overall Score</span>
        </div>

        {/* Answer Relevance */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-emerald-400 font-mono">{report.answer_relevance}%</span>
          <span className="text-[11px] font-medium text-slate-300 mt-1">Relevance</span>
        </div>

        {/* Technical Understanding */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-cyan-400 font-mono">{report.technical_understanding}%</span>
          <span className="text-[11px] font-medium text-slate-300 mt-1">Technical Depth</span>
        </div>

        {/* Communication Clarity */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-purple-400 font-mono">{report.communication_clarity}%</span>
          <span className="text-[11px] font-medium text-slate-300 mt-1">Clarity & Pacing</span>
        </div>

        {/* Confidence Indicator */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-amber-400 font-mono">{report.confidence_indicator}%</span>
          <span className="text-[11px] font-medium text-slate-300 mt-1">Delivery Poise</span>
        </div>

      </div>

      {/* Observations Box */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Comprehensive Observations
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed">
          {report.overall_observations}
        </p>
        <p className="text-[11px] text-slate-500 mt-3 italic border-t border-slate-800/80 pt-2">
          Note: Confidence metrics are derived from speech volume pacing, vocabulary completeness, and structural organization.
        </p>
      </div>

      {/* Strong Areas & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strong Areas */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Strong Competencies
          </h3>
          <ul className="space-y-3">
            {report.strong_areas.map((st, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Areas Needing Refinement
          </h3>
          <ul className="space-y-3">
            {report.weak_areas.map((wk, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Model Answer Pairs & STAR Coaching (Multilingual!) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Example Model Answers & STAR Improvement Tips</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Delivered in: {report.language_label}
          </span>
        </div>

        <div className="space-y-5">
          {report.example_improved_answers.map((pair, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Question #{idx + 1}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                {pair.question}
              </h4>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Your Answer:</span> "{pair.candidate_answer}"
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">Recommended Model Answer ({report.language_label}):</span>
                {pair.improved_model_answer}
              </div>

              <div className="text-[11px] text-amber-300 flex items-center gap-1.5">
                <span className="font-bold">Coaching Tip:</span> {pair.key_improvement_tips}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Topics to Study */}
      <div className="glass-card-active rounded-2xl p-6 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span>Suggested Technical Topics to Study Before Next Round</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {report.suggested_topics_to_study.map((top, idx) => (
              <span key={idx} className="px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
                {top}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 whitespace-nowrap transition-colors"
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
};
