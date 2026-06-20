from llm.providers.openai import OpenAIProvider

provider = OpenAIProvider()

answer = provider.generate(
    "Python is a programming language.",
    "What is Python?"
)

print(answer)