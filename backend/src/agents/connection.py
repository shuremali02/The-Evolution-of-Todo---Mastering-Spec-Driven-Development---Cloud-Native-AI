import os
from agents import AsyncOpenAI, OpenAIChatCompletionsModel
from dotenv import load_dotenv
from agents.run import RunConfig

print("Loading connection configuration...")
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
print(f"Gemini API key loaded: {'Yes' if gemini_api_key else 'No'}")

external_provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai"
)

model = OpenAIChatCompletionsModel(
    openai_client=external_provider,
    model="gemini-2.5-flash",
)

config = RunConfig(
    model=model,
    model_provider=external_provider,
    tracing_disabled=True
)

print(f"Configuration created successfully. Model: {model.model}")