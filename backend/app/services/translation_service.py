import httpx
from typing import Optional
from app.core.config import settings

class TranslationService:
    def __init__(self):
        self.api_key = settings.TRANSLATION_API_KEY
        self.api_url = settings.TRANSLATION_API_URL
    
    async def translate_text(
        self, 
        text: str, 
        source_language: str, 
        target_language: str
    ) -> Optional[str]:
        """
        Translate text from source language to target language
        """
        if not self.api_key or not self.api_url:
            # Fallback to simple translation logic
            return self._fallback_translate(text, source_language, target_language)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "text": text,
                        "source": source_language,
                        "target": target_language
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("translated_text", text)
                else:
                    # Fallback if API fails
                    return self._fallback_translate(text, source_language, target_language)
        
        except Exception:
            # Fallback if request fails
            return self._fallback_translate(text, source_language, target_language)
    
    def _fallback_translate(self, text: str, source_language: str, target_language: str) -> str:
        """
        Simple fallback translation logic
        """
        # This is a placeholder - in production you'd want a more sophisticated fallback
        if source_language == target_language:
            return text
        
        # Simple language detection and basic translations
        language_mappings = {
            "en": "English",
            "vi": "Vietnamese", 
            "ja": "Japanese",
            "zh": "Chinese",
            "ko": "Korean",
            "fr": "French",
            "de": "German",
            "es": "Spanish",
            "pt": "Portuguese",
            "it": "Italian"
        }
        
        source_name = language_mappings.get(source_language, source_language)
        target_name = language_mappings.get(target_language, target_language)
        
        return f"[{source_name} -> {target_name}] {text}"
    
    def get_supported_languages(self) -> list:
        """
        Get list of supported languages
        """
        return [
            {"code": "en", "name": "English", "flag": "🇺🇸"},
            {"code": "vi", "name": "Vietnamese", "flag": "🇻🇳"},
            {"code": "ja", "name": "Japanese", "flag": "🇯🇵"},
            {"code": "zh", "name": "Chinese", "flag": "🇨🇳"},
            {"code": "ko", "name": "Korean", "flag": "🇰🇷"},
            {"code": "fr", "name": "French", "flag": "🇫🇷"},
            {"code": "de", "name": "German", "flag": "🇩🇪"},
            {"code": "es", "name": "Spanish", "flag": "🇪🇸"},
            {"code": "pt", "name": "Portuguese", "flag": "🇵🇹"},
            {"code": "it", "name": "Italian", "flag": "🇮🇹"},
            {"code": "ru", "name": "Russian", "flag": "🇷🇺"},
            {"code": "ar", "name": "Arabic", "flag": "🇸🇦"},
            {"code": "hi", "name": "Hindi", "flag": "🇮🇳"},
            {"code": "th", "name": "Thai", "flag": "🇹🇭"},
            {"code": "nl", "name": "Dutch", "flag": "🇳🇱"},
            {"code": "pl", "name": "Polish", "flag": "🇵🇱"},
            {"code": "tr", "name": "Turkish", "flag": "🇹🇷"},
            {"code": "sv", "name": "Swedish", "flag": "🇸🇪"},
            {"code": "da", "name": "Danish", "flag": "🇩🇰"},
            {"code": "no", "name": "Norwegian", "flag": "🇳🇴"}
        ]

translation_service = TranslationService()
