from typing import Dict, Any

LANGUAGE_SPEECH_CONFIG = {
    "en": {"code": "en-US", "voice_name": "Google US English", "pitch": 1.0, "rate": 1.0},
    "hi": {"code": "hi-IN", "voice_name": "Google हिन्दी", "pitch": 1.0, "rate": 0.95},
    "kn": {"code": "kn-IN", "voice_name": "Google ಕನ್ನಡ", "pitch": 1.0, "rate": 0.95},
    "te": {"code": "te-IN", "voice_name": "Google తెలుగు", "pitch": 1.0, "rate": 0.95},
    "ta": {"code": "ta-IN", "voice_name": "Google தமிழ்", "pitch": 1.0, "rate": 0.95},
}

class SpeechService:
    @staticmethod
    def get_speech_config(language_code: str) -> Dict[str, Any]:
        return LANGUAGE_SPEECH_CONFIG.get(language_code, LANGUAGE_SPEECH_CONFIG["en"])
