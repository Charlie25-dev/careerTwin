import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { Resume } from '../types';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, Sparkles, 
  ArrowRight, Zap, RefreshCw, Info
} from 'lucide-react';

interface ResumeUploadPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer Intern');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const resume = await api.uploadResume(file, targetRole);
      onNavigate('resume-analysis', resume);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and analyze resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = async (sampleType: 'software_engineer' | 'iot_engineer') => {
    setIsUploading(true);
    setError(null);
    try {
      const resume = await api.loadSampleResume(sampleType);
      onNavigate('resume-analysis', resume);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
          AI Resume Analysis
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-3">Upload Your Resume</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Supported formats: <strong className="text-white">PDF</strong>, <strong className="text-white">DOCX</strong>. Our parser extracts your project architecture, technical competencies, and calculates realistic ATS improvement recommendations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Role Selector */}
      <div className="mb-6 glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300">Target Career Role for Analysis:</label>
          <p className="text-[11px] text-slate-400">Analysis will tailor missing skills and benchmark against this title</p>
        </div>
        <select
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="Software Engineer Intern">Software Engineer Intern</option>
          <option value="Full-Stack Web Developer">Full-Stack Web Developer</option>
          <option value="IoT & Embedded Systems Engineer">IoT & Embedded Systems Engineer</option>
          <option value="Data Science & ML Intern">Data Science & ML Intern</option>
        </select>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-panel border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          dragActive
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
            : file
            ? 'border-emerald-500/60 bg-emerald-500/5'
            : 'border-slate-700 hover:border-slate-500 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="hidden"
        />

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
          file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-500/20 text-brand-400'
        }`}>
          {file ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
        </div>

        {file ? (
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{file.name}</h3>
            <p className="text-xs text-emerald-400 font-mono">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
            </p>
            <p className="text-xs text-slate-400 mt-2">Click or drag a different file to replace</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Drag & drop your resume here, or <span className="text-brand-400 underline underline-offset-4">browse files</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Maximum file size: 5MB • Formats: PDF, DOCX
            </p>
          </div>
        )}
      </div>

      {/* Upload Action Button */}
      {file && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center space-x-2.5"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing & Running AI Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Fast Demo Mode Resumes Section */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Don't have a resume PDF ready? Try 1-Click Sample Resumes
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Instantly test the full analysis dashboard and mock interview flow using pre-seeded, realistic student profiles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            type="button"
            onClick={() => handleLoadSample('software_engineer')}
            disabled={isUploading}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-brand-500 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white group-hover:text-brand-300">
                Aarav Sharma
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                Full-Stack SWE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Features: Collaborative code editor, WebSockets, React, Docker, and NexGen tech internship experience.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample('iot_engineer')}
            disabled={isUploading}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-emerald-500 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white group-hover:text-emerald-300">
                Priya Nair
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                IoT Systems
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Features: IoT Air Quality Monitoring System with MQ135 sensor, ESP32 telemetry, and C++ firmware.
            </p>
          </button>

        </div>
      </div>

    </div>
  );
};
