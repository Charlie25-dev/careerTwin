import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Briefcase, Mail, Languages, Shield, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (view: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, refreshUser, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer Intern');
  const [preferredLang, setPreferredLang] = useState(user?.preferred_language || 'en');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      await api.updateProfile({
        full_name: fullName,
        target_role: targetRole,
        preferred_language: preferredLang as any
      });
      await refreshUser();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      "WARNING: This will permanently delete your profile, all uploaded resumes, extracted data, and interview histories.\n\nType 'DELETE' to confirm:"
    );

    if (confirmation === 'DELETE') {
      setIsDeleting(true);
      try {
        await api.deleteAccount();
        logout();
        alert('Your account and all associated data have been permanently erased from CareerCoach AI.');
        onNavigate('landing');
      } catch (err: any) {
        alert(err.message || 'Failed to delete account');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Profile & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your target role, preferred interview language, and privacy settings</p>
      </div>

      {updateSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Account ID)</label>
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-500 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer Intern, Data Science Associate"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Interview Language</label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md transition-all"
            >
              {isUpdating ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

        </form>
      </div>

      {/* Privacy & Account Deletion (Requirement #15) */}
      <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 bg-rose-500/5 space-y-4">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
          <Trash2 className="w-4 h-4" />
          <span>Privacy Rights: Permanent Account Erasure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In strict compliance with privacy guidelines, you can permanently erase all stored documents, resumes, and interview transcripts at any time. This action is irreversible.
        </p>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-xs font-bold text-white transition-colors"
        >
          {isDeleting ? 'Erasing Data...' : 'Permanently Delete Account & All Data'}
        </button>
      </div>

    </div>
  );
};
