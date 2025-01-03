from pydantic import BaseModel, Field
from typing import List, Optional, Union


class MarkedCheckpoint(BaseModel):
    check_point_name: str = Field(description="The name of the correlated checkpoint.")
    status: str = Field(
        description="The status of the checkpoint either being Correct, Uncertain, or Incorrect based on the content of the application."
    )
    reason: str = Field(description="The reason for the status of the checkpoint.")


class SummaryResponse(BaseModel):
    summary: list[str] = Field(description="The summary of the application documents.")
    marked_checklist: list[MarkedCheckpoint] = Field(
        description="The marked checklist items.",
        default_factory=list,
    )
    cad_aid_summary: Optional[str]
    arkivgpt_summary: Optional[str]


class ApplicationSummary(BaseModel):
    summary: list[str] = Field(
        description="A concise summary of the application documents."
    )


class PlanPratRequest(BaseModel):
    query: str


class PlanPratResponse(BaseModel):
    answer: str


class PropertyIdentifiers(BaseModel):
    gnr: Optional[int] = None
    bnr: Optional[int] = None
    snr: Optional[int] = None


class ArkivGPTResponse(BaseModel):
    Id: str
    Resolution: str
    Document: str


class Detection(BaseModel):
    file_name: str
    drawing_type: Optional[Union[str, List[str]]] = None
    scale: Optional[str] = None
    room_names: Optional[str] = None
    cardinal_direction: Optional[str] = None
