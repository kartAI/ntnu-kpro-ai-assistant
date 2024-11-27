import os
from dotenv import load_dotenv

load_dotenv()

ARKIVGPT_URL = os.getenv("ARKIVGPT_URL", "http://localhost:80/api")
CADAID_URL = os.getenv("CADAID_URL", "http://localhost:5001/detect/")

AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")
LANGCHAIN_TRACING = os.getenv("LANGCHAIN_TRACING", "false") == "true"
