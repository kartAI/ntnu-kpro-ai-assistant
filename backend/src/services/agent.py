import logging
from typing import Annotated
from typing_extensions import TypedDict
from dotenv import load_dotenv

import os
from langchain_openai import AzureChatOpenAI, AzureOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_openai import AzureOpenAI
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.output_parsers import StrOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from src.configuration import API_KEY
from src.types import (
    ApplicationSummary,
    PropertyIdentifiers,
    SummaryResponse,
    Detection,
)

logger = logging.getLogger(__name__)


client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

llm = AzureChatOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)


def invoke_plan_agent(query: str) -> str:
    """
    Invoke the plan agent.

    Args:
        query (str): The query to the plan agent.
    Returns:
        str: The response from the plan agent.

    """

    prompt = PromptTemplate(
        template="""
        You are a senior municipality worker specializing in the regulation of building permits. A citizen has come to you with a question. Write a response to the citizen's question:
        Query: {query}

        Use the following context of the laws and regulations in your response:
        {context}
        Remember that the user does not have the same level of expertise as you do, so make sure to explain the laws and regulations in a way that is easy to understand.
        Also know that the context is not seen by the user, only you.
        You shall answer the user's query in the same language as the user.

        """
    )
    logger.info(f"context: {_retrieve_law_context()}")
    generate = prompt | llm
    response = generate.invoke({"query": query, "context": _retrieve_law_context()})
    logger.info(f"Response: {response}")
    return response.content


def _retrieve_law_context():
    context = ""
    with open("law_context.txt", "r") as file:
        context = file.read()
    return context


def find_property_identifiers(file_contents: list[str]) -> PropertyIdentifiers:
    content = "\n".join(file_contents)

    prompt = PromptTemplate(
        template="""
        You are an assistant that helps with finding finding three particular numbers, gnr (gårdsnummer), bnr (bruksnummer), snr (seksjonsnummer) in building permits.

        In Norway, a property's unique designation in the land register is known as the gårds- og bruksnummer (gnr/bnr), identifying a farm (gårdsnummer) and a subdivided unit (bruksnummer). 
        New properties get sequential bruksnummer, and leased plots receive a festenummer (fnr). Apartments with independent ownership must also have a seksjonsnummer. 
        For full uniqueness, the designation, or registernummeret, includes a municipality number (knr) as a prefix, though it's typically omitted within the municipality.

        Examples:
        (Knr. 1101,) gnr. 1, bnr. 2 (1/2)
        (Knr. 1101,) gnr. 1, bnr. 2, fnr. 1 (1/2/1)
        (Knr. 1101,) gnr. 1, bnr. 2, snr. 1 (1/2/0/1)

        You are tasked with these numbers in the following text.
        Building permit: {content}

        Please format your response as a JSON object matching the PropertyIdentifiers model with these exact keys they can only be integers, else set it as None:
        - "gnr": Optional(int) The gårdsnummer for the property.
        - "bnr": Optional(int) The bruksnummer for the property.
        - "snr": Optional(int) The seksjonsnummer for the property.
        """
    )
    chain = prompt | llm | PydanticOutputParser(pydantic_object=PropertyIdentifiers)
    property_identifiers = chain.invoke({"content": content})
    return property_identifiers


def invoke_agent(
    file_contents: list[str], cadaid_detections: list[Detection]
) -> SummaryResponse:
    """
    Invoke the summarization agent.

    Args:
        file_content (list[str]): The content of the files to summarize.
    Returns:
        SummaryResponse: The summarization response.

    """
    # TODO: Implement the agent logic
    summary = summarize_application_documents(file_contents)
    return SummaryResponse(
        summary=summary,
        cad_aid_summary="",
        arkivgpt_summary="",
    )


def summarize_application_documents(documents: list[str]) -> list[str]:
    # Define the parser
    summarization_parser = PydanticOutputParser(pydantic_object=ApplicationSummary)

    # Define the prompt template
    prompt = PromptTemplate(
        template="Write a concise summary using this format: \n\n{format_instructions}\n\nof the following application:\n\n{context}",
        input_variables=["context"],
        partial_variables={
            "format_instructions": summarization_parser.get_format_instructions(),
        },
    )

    # Initialize the LLM (adjust parameters as needed)

    chain = prompt | llm | summarization_parser

    # Generate the summary
    wrapper: ApplicationSummary = chain.invoke({"context": "\n\n".join(documents)})
    return wrapper.summary
