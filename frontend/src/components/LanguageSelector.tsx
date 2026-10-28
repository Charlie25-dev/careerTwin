import React from 'react';
import { Languages, Check, Globe } from 'lucide-react';
import { LanguageCode } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  native: string;
  tagline: string;
  badge?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    tagline: 'Standard global tech interview dialect',
    badge: 'Default'
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    tagline: 'सहज व्यावसायिक एवं तकनीकी साक्षात्कार',
    badge: 'Popular'
  },
  {
    code: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    tagline: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಆತ್ಮವಿಶ್ವಾಸದ ಸಂದರ್ಶನ',
    badge: 'Regional'
  },
  {
    code: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    tagline: 'సులభమైన సాంకేతిక సంభాషణ మరియు ఫీడ్‌బ్యాక్',
    badge: 'Regional'
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    tagline: 'தாய்மொழியில் துல்லியமான தொழில்நுட்ப நேர்காணல்',
    badge: 'Regional'
  }
];

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-slate-300">
        <Languages className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-semibold text-white">Choose Your Interview Language</h3>
      </div>
      <p className="text-xs text-slate-400">
        The AI interviewer will adapt questions, listen to your spoken or written responses, and formulate your feedback report in this language.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-600/20 border-brand-500 ring-2 ring-brand-500/40 shadow-lg shadow-brand-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white tracking-wide">
                      {lang.native}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ({lang.name})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {lang.tagline}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1.5">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700" />
                  )}
                  {lang.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-brand-500/30 text-brand-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {lang.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
