import React from 'react';
import { Resume } from '../types';
import { 
  Sparkles, CheckCircle, AlertTriangle, TrendingUp, 
  Code, FolderGit2, Briefcase, GraduationCap, Award, 
  ArrowRight, ShieldAlert, Cpu, Video, Download
} from 'lucide-react';

interface ResumeAnalysisPageProps {
  resume: Resume;
  onNavigate: (view: string, data?: any) => void;
}

export const ResumeAnalysisPage: React.FC<ResumeAnalysisPageProps> = ({ resume, onNavigate }) => {
  const analysis = resume.analysis || {
    overview: 'Resume analysis summary',
    ats_score: 78,
    strengths: [],
    improvement_areas: [],
    skills_identified: [],
    recommended_skills: [],
    project_analysis: [],
    experience_analysis: [],
    structure_analysis: {},
    ats_observations: [],
    actionable_recommendations: []
  };

  const parsed = resume.parsed_data || {
    candidate_name: 'Candidate',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: []
  };

  const atsScore = analysis.ats_score || resume.ats_score || 78;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 font-mono">
            Analysis Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            {parsed.candidate_name || 'Candidate'} — Resume Evaluation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            File: <span className="text-slate-300 font-mono">{resume.filename}</span> • Processed on {new Date(resume.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('interview-setup', { resume_id: resume.id })}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 font-bold text-sm text-white shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02]"
          >
            <Video className="w-4 h-4" />
            <span>Practice AI Interview With This Resume</span>
          </button>
        </div>
      </div>

      {/* Hero Overview & ATS Readiness Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overview Box */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400 mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Executive Overview
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {analysis.overview}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div>
              Format: <span className="font-semibold text-white uppercase">{resume.file_type}</span>
            </div>
            <span>•</span>
            <div>
              Readability: <span className="font-semibold text-emerald-400">{analysis.structure_analysis?.readability || 'High'}</span>
            </div>
            <span>•</span>
            <div>
              Target: <span className="font-semibold text-indigo-300">Entry-Level / Internship</span>
            </div>
          </div>
        </div>

        {/* ATS Readiness Gauge */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Potential ATS Readiness Indicator
          </p>
          
          <div className="relative my-2">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                className="text-emerald-400"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - atsScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white font-mono">{atsScore}</span>
              <span className="text-[10px] text-slate-400">out of 100</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-normal">
            Reflects parser indexing clarity and quantified bullet completeness. (No system can guarantee hiring outcomes).
          </p>
        </div>

      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Demonstrated Strengths
          </h3>
          <ul className="space-y-3">
            {(analysis.strengths || []).map((st, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Potential ATS & Content Improvement Areas
          </h3>
          <ul className="space-y-3">
            {(analysis.improvement_areas || []).map((ia, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{ia}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Skills Matrix: Identified vs Missing/Recommended */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-400" />
          <span>Competency & Technology Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2.5">
              Identified Skills in Resume ({analysis.skills_identified?.length || 0}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis.skills_identified || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2.5">
              Recommended Skills to Learn for Target Role:
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis.recommended_skills || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-1">
                  <span>+</span> {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Experience Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project Analysis */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-purple-400" />
            <span>Project Analysis</span>
          </h3>

          <div className="space-y-4">
            {(analysis.project_analysis || []).map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-bold text-purple-300">{proj.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proj.assessment}</p>
                <div className="mt-2 text-xs text-indigo-300 bg-indigo-950/40 p-2 rounded border border-indigo-500/20">
                  <strong>Recommendation:</strong> {proj.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Structure Analysis */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Experience & Formatting Analysis</span>
            </h3>

            {(analysis.experience_analysis || []).map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-bold text-cyan-300">{exp.status}</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{exp.observation}</p>
                <p className="text-xs text-slate-400 mt-1 italic">Tip: {exp.suggestion}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Potential ATS Observations:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(analysis.ats_observations || []).map((obs, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-slate-500 font-mono">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Actionable Recommendations Banner */}
      <div className="glass-card-active rounded-2xl p-6 border border-indigo-500/40">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Actionable Resume Action Items</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
          {(analysis.actionable_recommendations || []).map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-indigo-400 font-bold font-mono">0{i+1}.</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
