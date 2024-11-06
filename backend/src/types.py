from pydantic import BaseModel
from typing import Optional


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