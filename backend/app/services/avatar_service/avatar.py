from typing import Dict, Any

class AvatarService:
    """
    Manages avatar states: 'Speaking', 'Listening', 'Thinking', 'Idle'.
    Coordinates animation state transitions and visual indicators.
    """
    @staticmethod
    def get_avatar_state_meta(state: str) -> Dict[str, Any]:
        states = {
            "Speaking": {
                "label": "Interviewer Speaking",
                "color": "#3B82F6",  # blue
                "animation": "pulse-wave",
                "audio_reactive": True
            },
            "Listening": {
                "label": "Listening to Candidate...",
                "color": "#10B981",  # green
                "animation": "ripple-mic",
                "audio_reactive": True
            },
            "Thinking": {
                "label": "Analyzing Response...",
                "color": "#8B5CF6",  # purple
                "animation": "orbital-spin",
                "audio_reactive": False
            },
            "Idle": {
                "label": "Ready",
                "color": "#64748B",  # slate
                "animation": "breathe",
                "audio_reactive": False
            }
        }
        return states.get(state, states["Idle"])
