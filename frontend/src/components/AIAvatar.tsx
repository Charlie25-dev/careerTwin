import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Mic, Brain, MessageSquare } from 'lucide-react';
import { LanguageCode } from '../types';

interface AIAvatarProps {
  state: 'Speaking' | 'Listening' | 'Thinking' | 'Idle';
  textToSpeak?: string;
  language: LanguageCode;
  onSpeechEnd?: () => void;
  interviewerName?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  textToSpeak,
  language,
  onSpeechEnd,
  interviewerName = "Dr. Maya (Senior AI Evaluator)"
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Map language to speech locale
  const getSpeechLocale = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'te': return 'te-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-US';
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current || isMuted || !text) return;

    synthRef.current.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = getSpeechLocale(language);
    utterance.lang = locale;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best matching voice if available
    const voices = synthRef.current.getVoices();
    const matchedVoice = voices.find(v => v.lang === locale || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeakingLocal(true);
    };

    utterance.onend = () => {
      setIsSpeakingLocal(false);
      if (onSpeechEnd) onSpeechEnd();
    };

    utterance.onerror = () => {
      setIsSpeakingLocal(false);
      if (onSpeechEnd) onSpeechEnd();
    };

    synthRef.current.speak(utterance);
  };

  // Trigger speech when textToSpeak changes and state is Speaking
  useEffect(() => {
    if (state === 'Speaking' && textToSpeak && !isMuted) {
      speakText(textToSpeak);
    } else if (state !== 'Speaking') {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsSpeakingLocal(false);
    }
  }, [textToSpeak, state, isMuted, language]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleReplay = () => {
    if (textToSpeak) {
      speakText(textToSpeak);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden">
      
      {/* Background Ambient Glow based on State */}
      <div 
        className={`absolute -inset-10 opacity-30 blur-3xl transition-colors duration-700 pointer-events-none ${
          state === 'Speaking' 
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500' 
            : state === 'Listening'
            ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400'
            : state === 'Thinking'
            ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600'
            : 'bg-slate-800'
        }`}
      />

      {/* Top Status Header */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              state === 'Speaking' ? 'bg-blue-400' : state === 'Listening' ? 'bg-emerald-400' : state === 'Thinking' ? 'bg-purple-400' : 'bg-slate-500'
            }`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              state === 'Speaking' ? 'bg-blue-500' : state === 'Listening' ? 'bg-emerald-500' : state === 'Thinking' ? 'bg-purple-500' : 'bg-slate-500'
            }`} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {state === 'Speaking' && 'AI Speaking'}
            {state === 'Listening' && 'Listening to You'}
            {state === 'Thinking' && 'Evaluating Response'}
            {state === 'Idle' && 'Ready'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isMuted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={handleReplay}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
            title="Replay Voice Question"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Avatar Stage */}
      <div className="relative my-4 flex items-center justify-center">
        
        {/* State-driven Animated Rings */}
        {state === 'Speaking' && (
          <div className="absolute w-48 h-48 rounded-full border border-blue-500/40 animate-ping opacity-35" />
        )}
        {state === 'Listening' && (
          <div className="absolute w-52 h-52 rounded-full border-2 border-emerald-500/50 animate-pulse-slow" />
        )}
        {state === 'Thinking' && (
          <div className="absolute w-52 h-52 rounded-full border border-purple-500/40 animate-spin-slow border-dashed" />
        )}

        {/* Humanoid 3D-styled AI Avatar Circle */}
        <div className={`relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr transition-all duration-500 shadow-2xl flex items-center justify-center ${
          state === 'Speaking' 
            ? 'from-blue-500 via-indigo-500 to-cyan-400 ring-4 ring-blue-500/30 shadow-blue-500/40' 
            : state === 'Listening'
            ? 'from-emerald-500 via-teal-400 to-emerald-300 ring-4 ring-emerald-500/30 shadow-emerald-500/40'
            : state === 'Thinking'
            ? 'from-purple-500 via-fuchsia-500 to-indigo-500 ring-4 ring-purple-500/30 shadow-purple-500/40'
            : 'from-slate-700 to-slate-800 ring-2 ring-slate-700'
        }`}>
          
          <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
            
            {/* Holographic Avatar Face Graphic */}
            <div className="relative flex flex-col items-center">
              
              {/* Forehead / Head outline */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-500/30 flex flex-col items-center justify-center relative shadow-inner">
                
                {/* Eyes with blinking / expression */}
                <div className="flex space-x-4 mb-2">
                  <div className={`w-3.5 h-2 rounded-full transition-all duration-300 ${
                    state === 'Thinking' 
                      ? 'bg-purple-400 scale-75 animate-pulse' 
                      : state === 'Speaking'
                      ? 'bg-cyan-300 h-2.5 shadow-sm shadow-cyan-400'
                      : 'bg-indigo-300'
                  }`} />
                  <div className={`w-3.5 h-2 rounded-full transition-all duration-300 ${
                    state === 'Thinking' 
                      ? 'bg-purple-400 scale-75 animate-pulse' 
                      : state === 'Speaking'
                      ? 'bg-cyan-300 h-2.5 shadow-sm shadow-cyan-400'
                      : 'bg-indigo-300'
                  }`} />
                </div>

                {/* Mouth with Audio Waveform / Lip-Sync Simulation */}
                {state === 'Speaking' ? (
                  <div className="flex items-center space-x-0.5 h-3">
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-blue-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-2.5" style={{ animationDelay: '75ms' }} />
                  </div>
                ) : state === 'Listening' ? (
                  <div className="w-4 h-1 bg-emerald-400 rounded-full opacity-80" />
                ) : state === 'Thinking' ? (
                  <div className="w-3 h-1 bg-purple-400 rounded-full animate-pulse" />
                ) : (
                  <div className="w-4 h-0.5 bg-slate-500 rounded-full" />
                )}

              </div>

              {/* Neck & Shoulder Silhouette */}
              <div className="w-28 h-8 -mt-2 bg-gradient-to-b from-indigo-900/40 to-slate-950 rounded-t-3xl border-t border-indigo-500/20" />

            </div>

            {/* State Floating Icon Badge */}
            <div className="absolute bottom-2">
              {state === 'Speaking' && (
                <div className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] text-blue-300 flex items-center gap-1 font-mono">
                  <Volume2 className="w-2.5 h-2.5 animate-pulse" /> Speaking
                </div>
              )}
              {state === 'Listening' && (
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 flex items-center gap-1 font-mono">
                  <Mic className="w-2.5 h-2.5 animate-pulse" /> Listening
                </div>
              )}
              {state === 'Thinking' && (
                <div className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] text-purple-300 flex items-center gap-1 font-mono">
                  <Brain className="w-2.5 h-2.5 animate-spin" /> Thinking
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Evaluator Identity */}
      <div className="text-center z-10 mt-1">
        <h4 className="text-sm font-semibold text-white">{interviewerName}</h4>
        <p className="text-xs text-slate-400">Adaptive Career Coach • Multilingual AI</p>
      </div>

    </div>
  );
};
