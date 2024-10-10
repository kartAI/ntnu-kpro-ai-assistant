from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class SummaryResponse(BaseModel):
    summary: dict
    cad_aid_summary: dict
    arkivgpt_summary: dict


@app.post("/summarize")
def summarize(files: list[UploadFile], include_modules: bool = False) -> :
    """
    Summarize a file.

    Args:
        file (list[UploadFile]): The file to summarize.
        include_modules (bool): Whether to include additional modules like CAD-AiD and ArkivGPT.
    Returns:
        ResponseSummary: The summarization response.

    """
    response = SummaryResponse(summary={}, cad_aid_summary={}, arkivgpt_summary={})
    return response