import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Briefcase } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer Intern');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({
        full_name: fullName,
        email,
        password,
        target_role: targetRole,
        preferred_language: preferredLanguage
      });
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 border border-slate-700/80 shadow-2xl relative">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h2>
          <p className="text-sm text-slate-400 mt-1">Start preparing for campus placements & internships</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@college.edu"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Job Role</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Software Engineer Intern">Software Engineer Intern</option>
                <option value="Full-Stack Web Developer">Full-Stack Web Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Science / ML Intern">Data Science / ML Intern</option>
                <option value="IoT & Embedded Systems Engineer">IoT & Embedded Systems Engineer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-sm text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4"
          >
            Sign In here
          </button>
        </p>

      </div>
    </div>
  );
};
