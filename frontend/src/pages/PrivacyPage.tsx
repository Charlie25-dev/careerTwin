import React from 'react';
import { Shield, Lock, EyeOff, Trash2, Key, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (view: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="flex items-center space-x-3 mb-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
            Security & Privacy Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Data Protection & Privacy Policy</h1>
        </div>
      </div>

      <div className="glass-card-active rounded-2xl p-6 border border-emerald-500/30">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Our Privacy Commitment to Students & Candidates</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          CareerCoach AI was designed with privacy considered from day one, not retrofitted at the end. Your resume, career aspirations, and interview responses are private, protected, and fully within your control.
        </p>
      </div>

      {/* Grid of Key Privacy Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero Permanent Audio Retention</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We do not store your microphone voice recordings on our servers. Spoken audio is converted into text in real-time via the browser's Web Speech API and immediately discarded.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Strict Isolation & Multi-Tenant Security</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every resume, parsed profile, and mock transcript is tied directly to your authenticated user ID. No candidate's documents or answers are ever exposed or accessible to other users.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Secure Authentication & Secrets Management</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Passwords are cryptographically salted and hashed using bcrypt. API keys and secrets are strictly stored in server-side environment variables and are never transmitted to client JavaScript.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 mb-2">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Right to Permanent Erasure</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            You hold total control over your digital footprint. At any time via your Profile settings, you can trigger a permanent wipe of your account, all uploaded resume files, and all past interview sessions.
          </p>
        </div>

      </div>

      {/* Data Disclosure Details */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          What Data We Store & Why:
        </h3>
        
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Account Information:</strong> Full name, email address, password hash, and career target role. Used solely for authentication and personalized evaluations.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Resume Content:</strong> Extracted projects, skills, education, and bullet points. Used to generate accurate, non-hallucinated interview questions.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Mock Interview Transcripts:</strong> Text messages and AI feedback reports to allow you to review your progress over time.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
