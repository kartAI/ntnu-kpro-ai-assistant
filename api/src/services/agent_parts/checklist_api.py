import logging
import requests
import json
from pydantic import BaseModel
from typing import List, Optional

logger = logging.getLogger(__name__)


class Lovhjemmel(BaseModel):
    Lovhjemmel: str
    LovhjemmelUrl: Optional[str]


class Utfalltekst(BaseModel):
    Innholdstype: Optional[str]
    Tittel: Optional[str]
    Beskrivelse: Optional[str]


class Utfall(BaseModel):
    Utfallverdi: bool
    Utfalltype: Optional[str]
    Utfalltypekode: str
    Utfalltekst: Optional[Utfalltekst]


class Sjekkpunkt(BaseModel):
    Id: str
    Navn: str
    Beskrivelse: Optional[str]
    Lovhjemmel: List[Lovhjemmel]
    Utfall: List[Utfall]
    Undersjekkpunkter: List["Sjekkpunkt"] = []

    def __hash__(self):
        return hash(self.Id)

    class Config:
        frozen = True


def retrieve_current_national_checklist() -> list[Sjekkpunkt]:
    url = "https://sjekkliste-bygg-api.ft.dibk.no/api/sjekkliste"
    response = requests.get(url)
    data = response.json()
    json_data = [json.dumps(item) for item in data]
    checklist = []
    logger.info(f"Amount of items: {len(json_data)}")
    for item in json_data:
        try:
            checklist.append(Sjekkpunkt.model_validate_json(item))
        except Exception as e:
            logger.error(f"Error: {e} for Item: {item}")

    unique_checklist = set()
    for item in set(checklist):
        if not any(item.Id == x.Id for x in unique_checklist):
            unique_checklist.add(item)
    return list(unique_checklist)
