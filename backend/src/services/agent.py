import logging
from pydantic import Field
from typing_extensions import TypedDict

from langchain_core.prompts import PromptTemplate
from langchain_openai import AzureOpenAI
from langgraph.graph import StateGraph
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

from typing import List
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END


from src.services.agent_parts.generator import llm
from src.services.agent_parts.checklist_api import (
    Sjekkpunkt,
    retrieve_current_national_checklist,
)
from src.services.agent_parts.crag import (
    decide_to_generate,
    generate,
    grade_documents,
    retrieve,
    transform_query,
    web_search,
)

from src.types import (
    ApplicationSummary,
    MarkedCheckpoint,
    PropertyIdentifiers,
    SummaryResponse,
    Detection,
)

logger = logging.getLogger(__name__)


class RetrievalState(TypedDict):
    """
    Represents the state of our retrieval graph using CRAG.

    Attributes:
        question: question
        answer: LLMs answer based on the question and context
        web_search: whether to add search
        documents: list of documents
    """

    question: str
    generation: str
    web_search: str
    documents: list[str]


class AgentState(TypedDict):
    user_application_documents: list[str]
    retrieval_state: RetrievalState
    checklist: list[Sjekkpunkt]
    marked_checklist: list[MarkedCheckpoint]
    revisor_feedback: List[dict]
    should_retrieve: bool
    should_continue: bool
    revision_count: int


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
    summary = summarize_application_documents(file_contents)

    # Validate application with Checklist matching
    agent = create_graph()
    checklist = retrieve_current_national_checklist()
    marked_list = []

    for point in checklist:
        # Initial state
        initial_state = {
            "user_application_documents": file_contents,
            "retrieval_state": {
                "question": "",
                "generation": "",
                "web_search": "",
                "documents": [],
            },
            "checklist": [point],
            "marked_checklist": [],
            "reflection": "",
            "grading": "",
            "should_retrieve": False,
            "should_continue": True,
        }

        # Run the agent
        final_state = agent.invoke(initial_state)
        marked_list.extend(final_state["marked_checklist"])

    return SummaryResponse(
        summary=summary,
        marked_checklist=marked_list,
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


import json


def fill_out_checklist_responder(state):
    logger.info("\n---Filling out Checklist---")
    user_applications = state["user_application_documents"]
    checklist = state["checklist"]
    retrieval_state = state["retrieval_state"]
    documents = retrieval_state.get("documents", [])  # Retrieved laws and regulations

    # Combine all application documents into one string
    application_text = "\n\n".join(user_applications)
    # Combine all retrieved documents into one string
    laws_and_regulations = "\n\n".join([doc.page_content for doc in documents])

    marked_checklist = []
    need_retrieval = False  # Flag to determine if retrieval is needed

    # Check if there is feedback from the revisor
    feedback = state.get("revisor_feedback", None)

    # Determine if laws are available
    laws_available = bool(laws_and_regulations.strip())

    logger.info(f"Checklist: {checklist}")
    for idx, checkpoint in enumerate(checklist):
        # Extract the checkpoint text from the tuple
        # checkpoint_text = checkpoint[idx]
        checkpoint: Sjekkpunkt
        logger.info(f"Processing checkpoint {idx + 1}")
        logger.info(f"Checkpoint: {checkpoint}")
        checkpoint_text = checkpoint.model_dump()

        # If there is feedback for this checkpoint, use it
        if feedback:
            feedback_item = next(
                (item for item in feedback if item["checkpoint"] == checkpoint_text),
                None,
            )
        else:
            feedback_item = None

        if feedback_item:
            # Use the feedback to improve the marked checklist
            previous_status = feedback_item.get("status", "Uncertain")
            previous_reason = feedback_item.get("reason", "")
        else:
            previous_status = "Uncertain"
            previous_reason = ""

        # Construct the prompt
        if not laws_available:
            prompt = f"""
You are an expert in building regulations and codes.

First, read the following application documents:

{application_text}

Currently, you do not have access to the relevant laws and regulations.

Now, evaluate the following checkpoint:

"{checkpoint_text}"

Using only the information from the application, determine whether you have enough information to assess this checkpoint. If you don't have enough information due to the absence of laws and regulations, state that you need more information.

Provide your answer in the following JSON format without any additional text or formatting:

{{
  "status": "Uncertain",
  "reason": "Your reason here, indicating the need for more information."
}}

ONLY provide the JSON object. Do not include any markdown formatting like triple backticks or language indicators.
"""
        else:
            prompt = f"""
You are an expert in building regulations and codes.

First, read the following application documents:

{application_text}

Then, review the following laws and regulations:

{laws_and_regulations}

Previously, the status for the checkpoint was '{previous_status}' with the reason: '{previous_reason}'.

Now, re-evaluate the following checkpoint, taking into account this feedback:

"{checkpoint_text}"

Using the information from the application and the laws, determine whether the checkpoint is 'Correct', 'Incorrect', or 'Uncertain'. Provide a revised reason for your determination.

Provide your answer in the following JSON format without any additional text or formatting:

{{
  "check_point_name": "{checkpoint_text}",
  "status": "Correct" or "Incorrect" or "Uncertain",
  "reason": "Your reason here."
}}

ONLY provide the JSON object. Do not include any markdown formatting like triple backticks or language indicators.
"""

        # Get the response from the LLM
        response = llm.predict(prompt)

        # Clean the LLM response
        response = response.strip()

        # Remove Markdown code block formatting if present
        if response.startswith("```") and response.endswith("```"):
            response = response.strip("`")
            # Remove language identifier if present
            lines = response.strip().split("\n")
            if lines[0].strip().lower() in ("json", "javascript"):
                response = "\n".join(lines[1:])
            else:
                response = "\n".join(lines)

        # Parse the response
        try:
            result = json.loads(response)
            marked_checkpoint = MarkedCheckpoint(
                check_point_name=result.get("check_point_name", checkpoint.Navn),
                status=result.get("status", "Uncertain"),
                reason=result.get("reason", "No reason provided."),
            )
            # Only set need_retrieval to True if laws are not available and retrieval hasn't been performed
            if (not laws_available) and (
                "more information" in marked_checkpoint.reason.lower()
            ):
                need_retrieval = True
        except json.JSONDecodeError:
            # If parsing fails, mark as Uncertain and set retrieval flag only if laws are not available
            logger.error(f"Error parsing LLM response after cleanup: {response}")
            marked_checkpoint = MarkedCheckpoint(
                check_point_name=checkpoint.Navn,
                status="Uncertain",
                reason="Could not parse LLM response.",
            )
            if not laws_available:
                need_retrieval = True
        marked_checklist.append(marked_checkpoint)

    # Update the state with the marked checklist
    state["marked_checklist"] = marked_checklist
    state["should_retrieve"] = need_retrieval

    if need_retrieval:
        logger.info("Writing questions for retrieval.")
        uncertain_checkpoints = [
            cp.check_point_name for cp in marked_checklist if cp.status == "Uncertain"
        ]
        response = llm.predict(
            f"For the following checkpoints marked as 'Uncertain', ask max 3 questions to clarify the applicability of laws and regulations:\n\n{uncertain_checkpoints}"
        )
        logger.info(f"Question for retrieval: {response}")
        state["retrieval_state"]["question"] = response
        state["retrieval_performed"] = True  # Mark that retrieval has been performed

    # Clear the feedback after using it
    if "revisor_feedback" in state:
        del state["revisor_feedback"]

    # Initialize or increment the revision counter
    if "revision_count" not in state:
        state["revision_count"] = 0
    else:
        state["revision_count"] += 1

    return state


def decide_next_step_after_fill_out(state):
    """Decide whether to proceed to 'retrieve' or 'marked_checklist_revisor'."""
    if state["should_retrieve"]:
        logger.info("---DECISION: Need more information, proceeding to 'retrieve'---")
        return "retrieve"
    else:
        logger.info(
            "---DECISION: Enough information, proceeding to 'marked_checklist_revisor'---"
        )
        return "marked_checklist_revisor"


def decide_to_continue_after_revisor(state):
    """Decide whether to continue processing or end."""
    # Check if the revision count has reached the limit
    if state.get("revision_count", 0) >= 3:
        logger.info(
            f"---DECISION: Maximum revision count reached ({state['revision_count']}), ending process---"
        )
        return END

    if state.get("should_continue"):
        # Check if retrieval has already been performed
        if state.get("retrieval_performed", False):
            logger.info("---DECISION: Retrieval already performed, ending process---")
            return END
        else:
            logger.info(
                "---DECISION: Looping back to 'fill_out_checklist_responder'---"
            )
            return "fill_out_checklist_responder"
    else:
        logger.info("---DECISION: Process complete---")
        return END


def marked_checklist_revisor(state):
    """Node that revises the marked checklist and provides feedback."""
    logger.info("\n---Marked Checklist Revisor---")
    marked_checklist: list[MarkedCheckpoint] = state["marked_checklist"]
    checklist: list[Sjekkpunkt] = state["checklist"]
    application_text = "\n\n".join(state["user_application_documents"])
    # Prepare the checklist items for review
    checklist_with_marks = [
        {
            "checkpoint": checkpoint.Navn,  # Extract the text from the tuple
            "status": marked_checkpoint.status,
            "reason": marked_checkpoint.reason,
        }
        for checkpoint, marked_checkpoint in zip(checklist, marked_checklist)
    ]

    # Convert checklist_with_marks to JSON string for the prompt
    checklist_json = json.dumps(checklist_with_marks, indent=2)

    # Construct the prompt for the LLM
    prompt = f"""
You are an expert reviewer in building regulations.

Review the following marked checklist items for correctness and consistency:

{checklist_json}

Here is the application text:

{application_text}

If any of the statuses or reasons seem incorrect or inconsistent, provide the corrected status and reason for those items.

Provide your corrections in the following JSON format as a list without any additional text or formatting:

[
  {{
    "checkpoint": "Name of the checkpoint",
    "status": "Correct" or "Incorrect" or "Uncertain",
    "reason": "Your reason here."
  }},
  ...
]

ONLY provide the JSON array. Do not include any markdown formatting like triple backticks or language indicators.
"""

    # Get the response from the LLM
    response = llm.predict(prompt)

    # Clean the LLM response
    response = response.strip()

    # Remove Markdown code block formatting if present
    if response.startswith("```") and response.endswith("```"):
        response = response.strip("`")
        # Remove language identifier if present
        lines = response.strip().split("\n")
        if lines[0].strip().lower() in ("json", "javascript"):
            response = "\n".join(lines[1:])
        else:
            response = "\n".join(lines)

    if "All good" in response.strip():
        # No revisions needed
        logger.info("No revisions needed.")
        state["should_continue"] = False
    else:
        try:
            revised_items = json.loads(response)
            # Store the feedback in the state
            state["revisor_feedback"] = revised_items
            state["should_continue"] = True
            logger.info("Feedback provided by revisor.")
        except json.JSONDecodeError:
            logger.error(
                f"Could not parse revision response after cleanup. LLM Response:\n{response}"
            )
            state["should_continue"] = False  # End process if parsing failed

    # Remove documents after revisor
    state["retrieval_state"]["documents"] = []

    return state


def create_graph() -> StateGraph:
    # Initialize the graph
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("retrieve", retrieve)
    workflow.add_node("grade_documents", grade_documents)
    workflow.add_node("generate", generate)
    workflow.add_node("transform_query", transform_query)
    workflow.add_node("web_search_node", web_search)
    workflow.add_node("fill_out_checklist_responder", fill_out_checklist_responder)
    workflow.add_node("marked_checklist_revisor", marked_checklist_revisor)

    # Build edges
    workflow.add_edge(START, "fill_out_checklist_responder")
    workflow.add_edge("retrieve", "grade_documents")
    workflow.add_conditional_edges(
        "grade_documents",
        decide_to_generate,
        {
            "transform_query": "transform_query",
            "generate": "generate",
        },
    )
    workflow.add_edge("transform_query", "web_search_node")
    workflow.add_edge("web_search_node", "generate")
    workflow.add_edge("generate", "fill_out_checklist_responder")
    workflow.add_conditional_edges(
        "fill_out_checklist_responder",
        decide_next_step_after_fill_out,
        {
            "retrieve": "retrieve",
            "marked_checklist_revisor": "marked_checklist_revisor",
        },
    )
    workflow.add_conditional_edges(
        "marked_checklist_revisor",
        decide_to_continue_after_revisor,
        {
            "fill_out_checklist_responder": "fill_out_checklist_responder",
            END: END,
        },
    )

    # Compile the graph
    app = workflow.compile()
    return app
