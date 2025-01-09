import logging
from fastapi import requests, UploadFile

from src.types import PropertyIdentifiers
from src.types import ArkivGPTResponse, Detection
from src.configuration import ARKIVGPT_URL, CADAID_URL

logger = logging.getLogger(__name__)


def query_cad_aid(files: list[UploadFile]) -> list[Detection]:
    form_data = {}
    for i, file in enumerate(files):
        form_data[f"uploaded_files_{i}"] = (file.filename, file.file, file.content_type)

    try:
        response = requests.post(CADAID_URL, files=form_data)
        response.raise_for_status()
        detections = response.json()
        return detections
    except requests.exceptions.RequestException as e:
        logger.error("Failed to communicate with CAD-AiD service: %s", e)
        return []


def query_arkivgpt(identifiers: PropertyIdentifiers) -> list[ArkivGPTResponse]:
    try:
        response = requests.get(
            f"{ARKIVGPT_URL}/Summary?GNR=${identifiers.gnr}&BNR=${identifiers.bnr}&SNR=${identifiers.snr}"
        )

        return response
    except Exception as e:
        logger.error("Failed to communicate with ArkivGPT service", e)
        return []
