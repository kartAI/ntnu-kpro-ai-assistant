import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import Chroma

from src.services.agent_parts.generator import llm, embedder, web_search_tool

logger = logging.getLogger(__name__)

urls = [
    "https://lovdata.no/dokument/NL/lov/2008-06-27-71/*#&#x2a;",
    "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
]

docs = [WebBaseLoader(url).load() for url in urls]
docs_list = [item for sublist in docs for item in sublist]

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=250, chunk_overlap=0
)
doc_splits = text_splitter.split_documents(docs_list)

# Add to vectorDB
vectorstore = Chroma.from_documents(
    documents=doc_splits,
    collection_name="rag-chroma",
    embedding=embedder,
)
retriever = vectorstore.as_retriever()


### Retrieval Grader

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field


# Data model
class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents."""

    binary_score: str = Field(
        description="Documents are relevant to the question, 'yes' or 'no'"
    )


# LLM with function call
structured_llm_grader = llm.with_structured_output(GradeDocuments)

# Prompt
system = """You are a grader assessing relevance of a retrieved document to a user question. \n 
    If the document contains keyword(s) or semantic meaning related to the question, grade it as relevant. \n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."""
grade_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
    ]
)

retrieval_grader = grade_prompt | structured_llm_grader
question = "agent memory"
docs = retriever.get_relevant_documents(question)
doc_txt = docs[1].page_content


### Generate

from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document

# Prompt
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question} 
Context: {context} 
Answer:""",
        ),
    ]
)


# Post-processing
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# Chain
rag_chain = prompt | llm | StrOutputParser()


# Prompt
system = """You a question re-writer that converts an input question to a better version that is optimized \n 
     for web search. Look at the input and try to reason about the underlying semantic intent / meaning."""
re_write_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        (
            "human",
            "Here is the initial question: \n\n {question} \n Formulate an improved question.",
        ),
    ]
)

question_rewriter = re_write_prompt | llm | StrOutputParser()


### Search


def retrieve(state):
    """
    Retrieve documents

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    logger.info("---RETRIEVE---")
    question = state["retrieval_state"]["question"]
    logger.info(f"Question: {question}")

    # Retrieval
    documents = retriever.get_relevant_documents(question)
    retrieval_state = {"documents": documents, "question": question}
    state["retrieval_state"] = retrieval_state
    return state


def generate(state):
    """
    Generate answer

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    logger.info("---GENERATE---")
    question = state["retrieval_state"]["question"]
    documents = state["retrieval_state"]["documents"]

    # RAG generation
    generation = rag_chain.invoke({"context": documents, "question": question})
    retrieval_state = {
        "documents": documents,
        "question": question,
        "generation": generation,
    }
    state["retrieval_state"] = retrieval_state
    return state


def grade_documents(state):
    """
    Determines whether the retrieved documents are relevant to the question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    """

    logger.info("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
    question = state["retrieval_state"]["question"]
    documents = state["retrieval_state"]["documents"]

    # Score each doc
    filtered_docs = []
    web_search = "No"
    for d in documents:
        score = retrieval_grader.invoke(
            {"question": question, "document": d.page_content}
        )
        grade = score.binary_score
        if grade == "yes":
            logger.info("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            logger.info("---GRADE: DOCUMENT NOT RELEVANT---")
            web_search = "Yes"
            continue
    retrieval_state = {
        "documents": filtered_docs,
        "question": question,
        "web_search": web_search,
    }
    state["retrieval_state"] = retrieval_state
    return state


def transform_query(state):
    """
    Transform the query to produce a better question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates question key with a re-phrased question
    """

    logger.info("---TRANSFORM QUERY---")
    question = state["retrieval_state"]["question"]
    documents = state["retrieval_state"]["documents"]

    # Re-write question
    better_question = question_rewriter.invoke({"question": question})
    retrieval_state = {"documents": documents, "question": better_question}
    state["retrieval_state"] = retrieval_state
    return state


def web_search(state):
    """
    Web search based on the re-phrased question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with appended web results
    """

    logger.info("---WEB SEARCH---")
    question = state["retrieval_state"]["question"]
    documents = state["retrieval_state"]["documents"]

    # Web search
    docs = web_search_tool.invoke({"query": question})
    logger.info(f"Web search results: {docs}")
    web_results = ""
    for d in docs:
        if isinstance(d, str):
            web_results += d + "\n"
        else:
            web_results += d.get("content", "No result")

    web_results = Document(page_content=web_results)
    documents.append(web_results)
    retrieval_state = {"documents": documents, "question": question}
    state["retrieval_state"] = retrieval_state
    return state


### Edges


def decide_to_generate(state):
    """
    Determines whether to generate an answer, or re-generate a question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    logger.info("---ASSESS GRADED DOCUMENTS---")
    state["retrieval_state"]["question"]
    web_search = state["retrieval_state"]["web_search"]
    state["retrieval_state"]["documents"]

    if web_search == "Yes":
        # All documents have been filtered check_relevance
        # We will re-generate a new query
        logger.info(
            "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---"
        )
        return "transform_query"
    else:
        # We have relevant documents, so generate answer
        logger.info("---DECISION: GENERATE---")
        return "generate"
