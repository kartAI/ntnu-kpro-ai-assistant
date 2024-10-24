import os
import logging
from typing import Annotated
from typing_extensions import TypedDict

from langchain_core.prompts import PromptTemplate
from langchain_openai import AzureOpenAI
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.output_parsers import StrOutputParser

from src.main import SummaryResponse

logger = logging.getLogger(__name__)

api_key = os.getenv("AZURE_OPENAI_API_KEY")
api_base = os.getenv("AZURE_OPENAI_API_BASE")
api_version = os.getenv("API_VERSION")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")


llm = AzureOpenAI(
    api_key=api_key,
    azure_endpoint=api_base,
    api_version=api_version,
    deployment_name=deployment_name,
    temperature=0.7,
)


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
        summary="",
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


graph_builder = StateGraph(GraphState)

graph_builder.add_node("essay_writer", essay_writer)
graph_builder.add_node("essay_grader", essay_grader)


graph_builder.add_edge("essay_grader", "essay_writer")
graph_builder.add_conditional_edges("essay_writer", should_continue)


graph_builder.set_entry_point("essay_writer")
graph_builder.set_finish_point("chatbot")
graph = graph_builder.compile()
