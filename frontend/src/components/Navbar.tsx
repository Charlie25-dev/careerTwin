import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, FileText, Video, History, Shield, LogOut, 
  User as UserIcon, Zap, Languages
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                CareerCoach <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Resume & Multilingual Interview Coach</p>
            </div>
          </div>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('resume-upload')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'resume-upload' || currentView === 'resume-analysis'
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Resume Analyzer</span>
              </button>

              <button
                onClick={() => onNavigate('interview-setup')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'interview-setup' || currentView === 'interview-room'
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Video className="w-4 h-4 text-emerald-400" />
                <span>AI Interview</span>
              </button>

              <button
                onClick={() => onNavigate('interview-history')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'interview-history'
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <History className="w-4 h-4 text-cyan-400" />
                <span>Past Sessions</span>
              </button>

              <button
                onClick={() => onNavigate('privacy')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'privacy'
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Privacy</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Privacy & Data
              </button>
            </div>
          )}

          {/* Right Action / Auth */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-slate-600 transition-colors"
                  title="View Profile & Settings"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={loginAsDemo}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
                  title="Instant Test with pre-seeded data"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>1-Click Demo</span>
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>

                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
