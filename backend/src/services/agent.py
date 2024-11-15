import os
import logging
from typing import Annotated
from typing_extensions import TypedDict
from dotenv import load_dotenv

from langchain_core.prompts import PromptTemplate
from langchain_openai import AzureOpenAI
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from src.main import SummaryResponse

logger = logging.getLogger(__name__)

load_dotenv()

api_key = os.getenv("AZURE_OPENAI_API_KEY")
api_base = os.getenv("AZURE_OPENAI_API_BASE")
api_version = os.getenv("API_VERSION")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

# TODO: add correct elements to the AzureOpenAI class
API_KEY = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0, api_key=API_KEY)


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


def invoke_agent(file_content: list[str]) -> SummaryResponse:
    """
    Invoke the summarization agent.

    Args:
        file_content (list[str]): The content of the files to summarize.
    Returns:
        SummaryResponse: The summarization response.

    """
    # TODO: Implement the agent logic
    return SummaryResponse(
        summary=file_content[0],
        cad_aid_summary="",
        arkivgpt_summary="",
    )


class GraphState(TypedDict):
    essay: str
    feedback: Annotated[list, add_messages]


def essay_writer(state: GraphState):
    """Node that generate a 3 paragraph essay"""
    print("\n---ESSAY WRITER---")
    essay = state["essay"] if "essay" in state else "No essay yet"
    prompt = PromptTemplate(
        template="""
        Write a 3 paragraph essay based on the following feedback:

        Essay: {essay}

        Update the essay based on the feedback:

        Feedback: {feedback}
        """
    )
    generate = prompt | llm | StrOutputParser()
    essay = generate.invoke({"essay": essay, "feedback": state["feedback"]})
    print("\nEssay: ", essay)
    return {"essay": [essay]}


def essay_grader(state: GraphState):
    """Node that grades an essay"""
    logger.info("Grading essay")
    prompt = PromptTemplate(
        template="""
        You are a teacher grading an essay. Provide clear and consise feedback on how to improve the essay:

        Essay: {essay}
        """
    )
    generate = prompt | llm
    feedback = generate.invoke(
        {"essay": state["essay"] if "essay" in state else "No essay yet"}
    )
    logger.info(f"Feedback: {feedback}")
    return {"feedback": [feedback]}


def should_continue(state: GraphState):
    """Node that checks if the user wants to continue"""
    logger.info("Checking if should continue")
    if len(state["feedback"]) > 3:
        return "__end__"
    else:
        return "essay_grader"


def create_agent():

    graph_builder = StateGraph(GraphState)

    graph_builder.add_node("essay_writer", essay_writer)
    graph_builder.add_node("essay_grader", essay_grader)

    graph_builder.add_edge("essay_grader", "essay_writer")
    graph_builder.add_conditional_edges("essay_writer", should_continue)

    graph_builder.set_entry_point("essay_writer")
    graph_builder.set_finish_point("chatbot")
    graph = graph_builder.compile()
    return graph
