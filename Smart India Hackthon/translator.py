# --------------------------------------------------------------------------
# Smart India Hackathon 2025
# Module: M4 - Multilingual Support
# Author: Teja

# Description:
# This module provides a "universal language adapter" for the RAG engine.
# It detects the user's language, translates their query to English for
# processing by the core AI, and then translates the AI's English
# response back into the user's original language.
# --------------------------------------------------------------------------

import os
import google.generativeai as genai
from dotenv import load_dotenv
from langdetect import detect, LangDetectException

# --- Step 1: Configuration and Initialization ---

# Load environment variables from a .env file in the root directory
# Ensure you have a .env file with: GEMINI_API_KEY="your_api_key"
load_dotenv()

# Configure the Google Generative AI client with the API key
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
except (ValueError, TypeError) as e:
    print(f"🔴 FATAL ERROR: Could not configure Gemini API. {e}")
    exit()

# Initialize the Gemini Pro model specifically for our translation tasks
translation_model = genai.GenerativeModel('gemini-1.0-pro')

# --- Step 2: Helper Functions ---

def detect_language(text: str) -> str:
    """
    Detects the language of the input text using the 'langdetect' library.

    Args:
        text (str): The user's query.

    Returns:
        str: The detected two-letter language code (e.g., 'hi', 'en', 'ta').
             Defaults to 'en' if detection is unreliable or fails.
    """
    # Langdetect can be unreliable on very short or ambiguous strings.
    # We enforce a minimum length and fall back to English for safety.
    if not text or len(text.strip()) < 10:
        return 'en'
    
    try:
        lang_code = detect(text)
        return lang_code
    except LangDetectException:
        # If the library throws an error, we safely default to English.
        print("⚠️ Warning: Language detection failed. Defaulting to English.")
        return 'en'

def translate_text(text: str, target_language_code: str, source_language_code: str = "auto") -> str:
    """
    Translates a given text to the target language using the Gemini model.

    Args:
        text (str): The text to be translated.
        target_language_code (str): The language code to translate to (e.g., 'hi').
        source_language_code (str): The language code of the original text.

    Returns:
        str: The translated text. Returns the original text if translation fails.
    """
    # Mapping codes to full names makes the prompt clearer for the LLM
    lang_map = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil',
        'mr': 'Marathi',
        # Add more supported Indian languages as needed
    }
    
    source_lang_full = lang_map.get(source_language_code, source_language_code)
    target_lang_full = lang_map.get(target_language_code, "English")

    # A clear, direct prompt for the LLM to perform the translation task
    prompt = f"""
    Act as an expert language translator.
    Translate the following text from "{source_lang_full}" to "{target_lang_full}".
    Your response must ONLY be the translated text itself, with no extra formatting,
    comments, or quotation marks.

    Text to translate: "{text}"
    """
    
    try:
        response = translation_model.generate_content(prompt)
        # We strip any potential leading/trailing whitespace from the model's output
        return response.text.strip()
    except Exception as e:
        print(f"🔴 ERROR: Translation API call failed. Reason: {e}")
        # As a fallback, we return the original text so the flow isn't broken.
        return text

# --- Step 3: Main Integration Class ---

class MultilingualManager:
    """
    A manager class to handle the end-to-end multilingual workflow.
    This is the main object that the API (M5) will interact with.
    """
    def __init__(self):
        print("✅ M4: Multilingual Manager has been initialized.")

    def process_input(self, query: str) -> tuple[str, str]:
        """
        Processes a raw user query. It detects the language and, if not English,
        translates it to English for the RAG engine.

        Args:
            query (str): The raw query from the user.

        Returns:
            tuple[str, str]: A tuple containing:
                             - The query in English.
                             - The original detected language code.
        """
        original_lang = detect_language(query)
        
        if original_lang == 'en':
            return query, 'en'
        
        print(f"🌍 M4: Detected language '{original_lang}'. Translating query to English...")
        english_query = translate_text(query, target_language_code='en', source_language_code=original_lang)
        print(f"🌍 M4: Translated query: '{english_query}'")
        return english_query, original_lang

    def process_output(self, answer: str, original_lang: str) -> str:
        """
        Processes the English answer from the RAG engine. It translates the
        answer back to the user's original language.

        Args:
            answer (str): The English answer generated by the RAG engine (M3).
            original_lang (str): The original language code of the user's query.

        Returns:
            str: The final answer, translated into the user's language.
        """
        if original_lang == 'en':
            return answer
            
        print(f"🌍 M4: Translating RAG answer back to '{original_lang}'...")
        translated_answer = translate_text(answer, target_language_code=original_lang, source_language_code='en')
        print(f"🌍 M4: Final translated answer: '{translated_answer}'")
        return translated_answer

# --- Main execution block for direct testing ---
# This allows you to run `python translator.py` to test the module in isolation.
if __name__ == '__main__':
    print("\n--- Running M4 Module Standalone Test ---\n")
    
    manager = MultilingualManager()
    
    # --- Test Case 1: Hindi Input ---
    print("--- Test Case 1: Hindi to English and back ---")
    hindi_query = "राजस्थान में तकनीकी शिक्षा के लिए छात्रवृत्ति योजनाएं क्या हैं?"
    
    # Simulate the flow M5 would use
    english_query, lang = manager.process_input(hindi_query)
    print(f"Original Query ({lang}): {hindi_query}")
    print(f"Processed for RAG Engine (en): {english_query}")
    
    # Simulate an answer from M3's RAG engine
    rag_engine_answer = "The main scholarship for technical education in Rajasthan is the Mukhyamantri Uchcha Shiksha Chhatravriti Yojana."
    print(f"\nSimulated RAG Answer (en): {rag_engine_answer}")
    
    final_user_answer = manager.process_output(rag_engine_answer, lang)
    print(f"Final Response for User ({lang}): {final_user_answer}\n")
    
    # --- Test Case 2: English Input (should not trigger translation) ---
    print("--- Test Case 2: English to English (no translation) ---")
    english_query_direct = "What are the admission criteria for the B.Tech program?"
    processed_query, lang = manager.process_input(english_query_direct)
    print(f"Original Query ({lang}): {english_query_direct}")
    print(f"Processed for RAG Engine (en): {processed_query}")
    
    rag_engine_answer_2 = "Admission requires a minimum of 75% in 12th grade science stream and a valid JEE Mains score."
    print(f"\nSimulated RAG Answer (en): {rag_engine_answer_2}")
    
    final_user_answer_2 = manager.process_output(rag_engine_answer_2, lang)
    print(f"Final Response for User ({lang}): {final_user_answer_2}\n")
