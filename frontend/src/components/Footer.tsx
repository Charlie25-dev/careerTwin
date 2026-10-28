import React from 'react';
import { Shield, Lock, Award, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center">
              <Award className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CareerCoach AI</p>
              <p className="text-xs text-slate-400">Next-Gen Resume Analysis & Multilingual Interview Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <button 
              onClick={() => onNavigate('privacy')}
              className="flex items-center space-x-1.5 hover:text-slate-200 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy & Data Policy</span>
            </button>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-brand-400" />
              <span>Zero Microphone Audio Storage</span>
            </div>
            <span className="text-slate-700">•</span>
            <span>English • हिन्दी • ಕನ್ನಡ • తెలుగు • தமிழ்</span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built for college grads & internship applicants with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>

        </div>
      </div>
    </footer>
  );
};
