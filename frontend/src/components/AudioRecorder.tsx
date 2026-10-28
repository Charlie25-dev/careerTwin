import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Keyboard, AlertCircle, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';

interface AudioRecorderProps {
  onAnswerSubmit: (answerText: string, audioDuration?: number) => void;
  isProcessing: boolean;
  language: LanguageCode;
  onListeningStateChange?: (isListening: boolean) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAnswerSubmit,
  isProcessing,
  language,
  onListeningStateChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Map language to speech recognition locale
  const getRecognitionLocale = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'te': return 'te-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-US';
    }
  };

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getRecognitionLocale(language);

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage(null);
        startTimeRef.current = Date.now();
        if (onListeningStateChange) onListeningStateChange(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. You can switch to text input anytime.');
          setInputMode('text');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Microphone notice: ${event.error}. You can also type your response below.`);
        }
        setIsRecording(false);
        if (onListeningStateChange) onListeningStateChange(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (onListeningStateChange) onListeningStateChange(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMessage('Speech recognition not directly available in this browser. Text input is ready.');
      setInputMode('text');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setInputMode('text');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      if (onListeningStateChange) onListeningStateChange(false);
    } else {
      setTranscript('');
      setErrorMessage(null);
      try {
        recognitionRef.current.lang = getRecognitionLocale(language);
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Error starting recognition:', e);
      }
    }
  };

  const handleSubmit = () => {
    const finalAnswer = inputMode === 'voice' 
      ? (transcript || textInput).trim()
      : textInput.trim();

    if (!finalAnswer) return;

    const duration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : undefined;
    
    // Stop recording if running
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      if (onListeningStateChange) onListeningStateChange(false);
    }

    onAnswerSubmit(finalAnswer, duration);
    setTranscript('');
    setTextInput('');
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl">
      
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'voice'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mic Mode</span>
          </button>

          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'text'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Text Keyboard Mode</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Lang: <span className="text-brand-300 uppercase">{language}</span>
        </span>
      </div>

      {errorMessage && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Voice Mode View */}
      {inputMode === 'voice' ? (
        <div className="space-y-4">
          
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-400 opacity-30" />
                  <button
                    onClick={toggleRecording}
                    className="relative w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 transition-transform"
                    title="Click to Stop Recording"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                </div>
                
                {/* Live Audio Visualizer Bars */}
                <div className="flex items-center space-x-1.5 h-6">
                  {[40, 70, 30, 90, 60, 80, 45, 100, 50, 75, 35].map((h, i) => (
                    <span 
                      key={i} 
                      className="w-1 bg-emerald-400 rounded-full animate-bounce"
                      style={{ 
                        height: `${h}%`,
                        animationDuration: `${400 + (i % 4) * 150}ms`
                      }} 
                    />
                  ))}
                </div>

                <p className="text-xs font-medium text-emerald-400 animate-pulse">
                  Listening to your answer... Click mic when done speaking
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                  title="Click to Start Recording"
                >
                  <Mic className="w-7 h-7" />
                </button>
                <p className="text-xs font-medium text-slate-300">
                  Tap microphone to answer using your voice
                </p>
              </div>
            )}

            {/* Live Transcript Preview */}
            <div className="w-full mt-4 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 min-h-[70px] text-sm text-slate-200">
              {transcript ? (
                <p className="italic leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Live voice transcript will appear here in real-time as you speak...
                </p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setInputMode('text')}
              className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
            >
              Need to edit or type manually?
            </button>

            <button
              onClick={handleSubmit}
              disabled={(!transcript && !textInput) || isProcessing}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                (!transcript && !textInput) || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30'
              }`}
            >
              <span>{isProcessing ? 'Analyzing...' : 'Submit Answer'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Text Fallback Mode View */
        <div className="space-y-3">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isProcessing}
            rows={4}
            placeholder="Type your detailed answer here... Feel free to articulate technical details, project architecture, and tradeoffs."
            className="w-full rounded-xl bg-slate-900/80 border border-slate-700 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {textInput.length} characters • {textInput.trim() ? textInput.trim().split(/\s+/).length : 0} words
            </span>

            <button
              onClick={handleSubmit}
              disabled={!textInput.trim() || isProcessing}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                !textInput.trim() || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30'
              }`}
            >
              <span>{isProcessing ? 'Analyzing Answer...' : 'Submit Answer'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
