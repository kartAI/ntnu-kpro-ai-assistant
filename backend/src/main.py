import logging
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Query, UploadFile
from fastapi import status


from src.services.reader import Reader
from src.services.readers.factory import create_reader

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SummaryResponse(BaseModel):
    summary: str
    cad_aid_summary: Optional[str]
    arkivgpt_summary: Optional[str]


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

        response = SummaryResponse(
            summary="",
            cad_aid_summary="",
            arkivgpt_summary="",
        )
        return response

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=str(e)
        )


def extract_text(file: UploadFile) -> str:
    reader: Reader = create_reader(file)
    return reader.read(file)
