from .base import BaseAIService
from .demo_provider import DemoAIService
from .gemini_provider import GeminiAIService
from app.config.settings import settings

_instance = None

def get_ai_service() -> BaseAIService:
    global _instance
    if _instance is None:
        if settings.AI_API_KEY and settings.AI_PROVIDER == "gemini":
            _instance = GeminiAIService(api_key=settings.AI_API_KEY)
        else:
            _instance = DemoAIService()
    return _instance

__all__ = ["BaseAIService", "DemoAIService", "GeminiAIService", "get_ai_service"]
