from langchain_openai import AzureChatOpenAI, OpenAIEmbeddings
from langchain_community.tools.tavily_search import TavilySearchResults

from src.configuration import (
    AZURE_API_KEY,
    AZURE_API_VERSION,
    AZURE_DEPLOYMENT_NAME,
    AZURE_OPENAI_ENDPOINT,
    OPENAI_API_KEY,
)


llm = AzureChatOpenAI(
    api_key=AZURE_API_KEY,
    deployment_name=AZURE_DEPLOYMENT_NAME,
    api_version=AZURE_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    temperature=0,
)


embedder = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

web_search_tool = TavilySearchResults(k=3)
