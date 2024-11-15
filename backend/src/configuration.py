import os
from dotenv import load_dotenv

load_dotenv()

ARKIVGPT_URL = os.getenv("ARKIVGPT_URL", "http://localhost:80/api")
CADAID_URL = os.getenv("CADAID_URL", "http://localhost:5001/detect/")

AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_API_BASE = os.getenv("AZURE_OPENAI_API_BASE")
AZURE_API_VERSION = os.getenv("API_VERSION")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

# TODO: add correct elements to the AzureOpenAI class
API_KEY = os.getenv("OPENAI_API_KEY")
