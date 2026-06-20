from llm.config import DEFAULT_PROVIDER

from llm.providers.gemini import GeminiProvider
from llm.providers.ollama import OllamaProvider
#from llm.providers.openai import OpenAIProvider


class LLMManager:

    def __init__(self):

        if DEFAULT_PROVIDER == "gemini":
            self.provider = GeminiProvider()

        elif DEFAULT_PROVIDER == "ollama":
            self.provider = OllamaProvider()

        elif DEFAULT_PROVIDER == "openai":
            self.provider = OpenAIProvider()

        else:
            raise ValueError(
                f"Unsupported provider: {DEFAULT_PROVIDER}"
            )

    def generate(self, context: str, question: str) -> str:

        return self.provider.generate(
            context,
            question
        )


llm_manager = LLMManager()