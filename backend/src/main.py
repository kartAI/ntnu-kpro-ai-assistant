from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Query, UploadFile

app = FastAPI()


class SummaryResponse(BaseModel):
    summary: str
    cad_aid_summary: Optional[str]
    arkivgpt_summary: Optional[str]


@app.post("/summarize", response_model=SummaryResponse)
def summarize(files: list[UploadFile], include_modules: bool = Query(False)) -> SummaryResponse:
    """
    Summarize a file.

    Args:
        file (list[UploadFile]): The file to summarize.
        include_modules (bool): Whether to include additional modules like CAD-AiD and ArkivGPT.
    Returns:
        ResponseSummary: The summarization response.

    """
    contents = [file.file.read() for file in files]

    for content in contents:
        if not content:
            raise HTTPException(status_code=400, detail="File is empty")

    response = SummaryResponse(
        summary="",
        cad_aid_summary="",
        arkivgpt_summary=""
    )
    return response
