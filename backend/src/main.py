import logging
from fastapi import FastAPI, HTTPException, Query, UploadFile
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware


from src.types import SummaryResponse, PlanPratRequest, PlanPratResponse
from src.services.reader import Reader
from src.services.readers.factory import create_reader
from src.services.agent import invoke_agent, invoke_plan_agent


app = FastAPI(
    title="KPRO API AI system",
    description="retrives tekst from user and returns an answer based on building regulations.",
    version="1.0.0",
)

ORIGINS = [
    "http://localhost:3000",
    "http://localhost:80",
    "http://localhost",
]
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


logging.basicConfig(filename="summary-assistant.log", level=logging.INFO)
logger = logging.getLogger(__name__)


@app.post("/summarize", response_model=SummaryResponse)
def summarize(
    files: list[UploadFile], include_modules: bool = Query(False)
) -> SummaryResponse:
    """
    Summarize a file.

    Args:
        file (list[UploadFile]): The file to summarize.
        include_modules (bool): Whether to include additional modules like CAD-AiD and ArkivGPT.
    Returns:
        ResponseSummary: The summarization response.

    """

    logger.info(f"Files: {files}")
    logger.info(f"Include modules: {include_modules}")
    logger.info(f"Number of files: {len(files)}")
    logger.info(
        f"First file: {files[0].filename}, content type: {files[0].content_type}"
    )
    try:
        contents = [extract_text(file) for file in files]
        logger.info(f"Contents: {contents}")
        for content in contents:
            if not content:
                raise HTTPException(status_code=400, detail="File is empty")

        response = invoke_agent(contents)
        return response

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=str(e)
        )


def extract_text(file: UploadFile) -> str:
    reader: Reader = create_reader(file)
    return reader.read(file)


@app.post("/plan-prat", response_model=PlanPratResponse)
def plan_prat(question: PlanPratRequest) -> PlanPratResponse:
    """
    PlanPrat a query.

    Args:
        question (PlanPratRequest): The query to PlanPrat.
    Returns:
        PlanPratResponse: The PlanPrat response.
backend/src/main.py
    """

    logger.info(f"Query: {question}")
    if not question.query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Query is empty"
        )
    print(f"Query: {question.query}", flush=True)

    response = invoke_plan_agent(question.query)
    return PlanPratResponse(answer=response)
