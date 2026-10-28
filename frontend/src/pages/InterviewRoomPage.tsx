import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NextQuestionResponse, LanguageCode } from '../types';
import { AIAvatar } from '../components/AIAvatar';
import { AudioRecorder } from '../components/AudioRecorder';
import { 
  Clock, Award, Brain, CheckCircle2, AlertCircle, 
  ArrowRight, StopCircle, RefreshCw, Volume2, Sparkles, Languages
} from 'lucide-react';

interface InterviewRoomPageProps {
  initialSessionData: NextQuestionResponse;
  sessionConfig: {
    resume_id?: number;
    interview_type: string;
    language: LanguageCode;
    difficulty: string;
    duration_minutes: number;
  };
  onNavigate: (view: string, data?: any) => void;
}

export const InterviewRoomPage: React.FC<InterviewRoomPageProps> = ({
  initialSessionData,
  sessionConfig,
  onNavigate
}) => {
  const [currentQuestionData, setCurrentQuestionData] = useState<NextQuestionResponse>(initialSessionData);
  const [avatarState, setAvatarState] = useState<'Speaking' | 'Listening' | 'Thinking' | 'Idle'>('Speaking');
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [previousEvaluation, setPreviousEvaluation] = useState<any>(initialSessionData.evaluation_previous || null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCandidateAnswer = async (answerText: string, audioDuration?: number) => {
    setIsProcessingAnswer(true);
    setAvatarState('Thinking');

    try {
      const nextResponse = await api.submitAnswer(
        currentQuestionData.session_id,
        answerText,
        audioDuration
      );

      setPreviousEvaluation(nextResponse.evaluation_previous || null);

      if (nextResponse.is_completed) {
        // Complete session and redirect to detailed feedback results
        setAvatarState('Speaking');
        setTimeout(() => {
          onNavigate('interview-results', { session_id: currentQuestionData.session_id });
        }, 1200);
      } else {
        setCurrentQuestionData(nextResponse);
        setAvatarState('Speaking');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit response. Please try again.');
      setAvatarState('Listening');
    } finally {
      setIsProcessingAnswer(false);
    }
  };

  const handleFinishEarly = async () => {
    if (confirm('Are you sure you want to conclude the interview and view your feedback report now?')) {
      setIsProcessingAnswer(true);
      setAvatarState('Thinking');
      try {
        await api.completeInterview(currentQuestionData.session_id);
        onNavigate('interview-results', { session_id: currentQuestionData.session_id });
      } catch (err: any) {
        alert(err.message || 'Failed to conclude interview.');
        setIsProcessingAnswer(false);
      }
    }
  };

  const currentQNum = currentQuestionData.question_number || 1;
  const totalQs = currentQuestionData.total_questions || 5;
  const progressPct = Math.round((currentQNum / totalQs) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Session Bar */}
      <div className="glass-panel rounded-2xl px-6 py-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Type & Topic */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">
                {sessionConfig.interview_type} Interview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono border border-slate-700">
                {currentQuestionData.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Topic: <strong className="text-slate-200">{currentQuestionData.topic}</strong>
            </p>
          </div>
        </div>

        {/* Center: Progress & Language */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <Languages className="w-4 h-4 text-brand-400" />
            <span className="uppercase font-bold text-brand-300 bg-brand-500/10 px-2 py-1 rounded border border-brand-500/30">
              {currentQuestionData.language}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-300">
              Question {currentQNum} of {totalQs}
            </span>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: End Early Action */}
        <button
          onClick={handleFinishEarly}
          disabled={isProcessingAnswer}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all"
        >
          <StopCircle className="w-3.5 h-3.5" />
          <span>Conclude & View Report</span>
        </button>

      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Animated AI Avatar */}
        <div className="lg:col-span-5 space-y-4">
          <AIAvatar
            state={avatarState}
            textToSpeak={currentQuestionData.question}
            language={currentQuestionData.language}
            onSpeechEnd={() => {
              // Once question speaking is complete, switch avatar to listening
              if (!isProcessingAnswer) {
                setAvatarState('Listening');
              }
            }}
          />

          {/* Real-Time Adaptive Feedback Snippet from Previous Answer */}
          {previousEvaluation && (
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Previous Answer Evaluation:</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {previousEvaluation.score}/10
                </span>
              </div>
              <p className="text-slate-300 italic text-[11px] leading-relaxed">
                "{previousEvaluation.feedback_snippet}"
              </p>
              {previousEvaluation.follow_up_reasoning && (
                <p className="text-[10px] text-indigo-300 font-mono border-t border-slate-800 pt-1.5">
                  Adaptive logic: {previousEvaluation.follow_up_reasoning}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Current Question Box + Voice/Text Input */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Question Display Card */}
          <div className="glass-card-active rounded-2xl p-6 border border-indigo-500/40 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Interviewer Question #{currentQNum}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                {currentQuestionData.language.toUpperCase()}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Candidate Answering Module (Microphone + Text Fallback) */}
          <AudioRecorder
            language={currentQuestionData.language}
            isProcessing={isProcessingAnswer}
            onListeningStateChange={(listening) => {
              if (!isProcessingAnswer) {
                setAvatarState(listening ? 'Listening' : 'Idle');
              }
            }}
            onAnswerSubmit={handleCandidateAnswer}
          />

        </div>

      </div>

    </div>
  );
};
