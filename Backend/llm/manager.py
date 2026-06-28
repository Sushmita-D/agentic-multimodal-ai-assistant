from llm.config import DEFAULT_PROVIDER


class LLMManager:

    def __init__(self):

        if DEFAULT_PROVIDER == "gemini":
            from llm.providers.gemini import GeminiProvider
            self.provider = GeminiProvider()

        elif DEFAULT_PROVIDER == "ollama":
            from llm.providers.ollama import OllamaProvider
            self.provider = OllamaProvider()

        elif DEFAULT_PROVIDER == "openai":
            from llm.providers.openai import OpenAIProvider
            self.provider = OpenAIProvider()

        else:
            raise ValueError(f"Unsupported provider: {DEFAULT_PROVIDER}")

    def generate(self, context: str, question: str) -> str:
        return self.provider.generate(context, question)


llm_manager = LLMManager()