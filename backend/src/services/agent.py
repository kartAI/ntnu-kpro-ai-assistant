import os
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from langchain_openai import AzureOpenAI


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


def invoke(file_content: list[str]) -> SummaryResponse:
    """
    Invoke the summarization agent.

    Args:
        file_content (list[str]): The content of the files to summarize.
    Returns:
        SummaryResponse: The summarization response.

    """
    pass


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
    print("\n---ESSAY GRADER---")
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
    print("\nFeedback: ", feedback)
    return {"feedback": [feedback]}


def should_continue(state: GraphState):
    """Node that checks if the user wants to continue"""
    print("\n---SHOULD CONTINUE---")
    if len(state["feedback"]) > 3:
        return "__end__"
    else:
        return "essay_grader"


workflow = StateGraph(GraphState)

workflow.add_node("essay_writer", essay_writer)
workflow.add_node("essay_grader", essay_grader)

workflow.add_edge(START, "essay_writer")
workflow.add_edge("essay_grader", "essay_writer")

workflow.add_conditional_edges("essay_writer", should_continue)

graph = workflow.compile()
