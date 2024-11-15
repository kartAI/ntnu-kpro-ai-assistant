from pydantic import BaseModel
from typing import List, Optional, Union


class SummaryResponse(BaseModel):
    summary: str
    cad_aid_summary: Optional[str]
    arkivgpt_summary: Optional[str]


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
