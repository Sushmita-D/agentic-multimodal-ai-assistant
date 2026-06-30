import os
from dotenv import load_dotenv

load_dotenv()

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# LLM Provider
DEFAULT_PROVIDER = os.getenv("DEFAULT_PROVIDER", "ollama")

# Gemini
GEMINI_MODEL = "gemini-2.5-flash"

# OpenAI
OPENAI_MODEL = "gpt-4o-mini"

# Ollama
OLLAMA_MODEL = "qwen3:4b"
OLLAMA_HOST = os.getenv(
    "OLLAMA_HOST",
    "http://host.docker.internal:11434"
)