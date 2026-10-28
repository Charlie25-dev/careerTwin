import React from 'react';
import { 
  Sparkles, Video, FileText, ArrowRight, ShieldCheck, 
  Languages, Cpu, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { loginAsDemo } = useAuth();

  return (
    <div className="relative overflow-hidden">
      
      {/* Hero Ambient Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/20 via-purple-600/20 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Multilingual Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <Languages className="w-3.5 h-3.5" />
          <span>Multilingual AI Coaching • English • हिन्दी • ಕನ್ನಡ • తెలుగు • தமிழ்</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
          Your AI-Powered <br className="hidden sm:inline" />
          <span className="text-gradient">Resume & Interview Coach</span>
        </h1>

        {/* Supporting Message */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Analyze your resume, practice personalized interviews, and prepare for your career in the language you're most comfortable with.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('resume-upload')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('interview-setup')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Try AI Interview</span>
          </button>

          <button
            onClick={loginAsDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>1-Click Hackathon Demo</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tailored for Students & Grads</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>5 Indian Languages Supported</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Audio Data Storage</span>
          </div>
        </div>

      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-400">Dual Core Capabilities</h2>
          <p className="mt-2 text-3xl font-extrabold text-white">Everything You Need To Ace Campus Placements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Resume Analyzer */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Resume Analyzer</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Upload your PDF or DOCX resume. Our AI extracts your projects, experiences, and technologies to provide actionable strengths, missing competencies, and ATS improvement observations.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Extracts Education, Skills, Projects, and Certifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>ATS-style observations with realistic improvement tips</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Identifies missing in-demand skills for target roles</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('resume-upload')}
              className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>Upload Resume & Get Analysis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Multilingual AI Interview Coach */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
              <Video className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">Multilingual AI Interview Coach</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Practice personalized conversational interviews grounded in your actual resume projects. Speak using your microphone in your native language with an interactive humanoid AI avatar.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Converses naturally in English, Hindi, Kannada, Telugu, Tamil</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Adaptive engine: dynamically asks deeper follow-ups to strong answers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Voice STT + TTS with speaking/listening/thinking avatar visual states</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('interview-setup')}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Start Multilingual Interview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Differentiator Banner: The Multilingual Advantage */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card-active rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              Our Core Differentiator
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">
              Break Language Barriers in Technical Interview Prep
            </h3>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Many bright engineering students think and reason best in their regional language. CareerCoach AI allows candidates to practice in their native dialect — evaluating clarity, technical logic, and communication without intimidation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['English (en)', 'हिन्दी (Hindi)', 'ಕನ್ನಡ (Kannada)', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)'].map((l) => (
                <span key={l} className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-200">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
