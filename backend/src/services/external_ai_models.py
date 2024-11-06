from fastapi import logger, requests
from src.types import PropertyIdentifiers
from src.types import ArkivGPTResponse
from src.configuration import ARKIVGPT_URL

def query_arkivgpt(identifiers: PropertyIdentifiers) -> list[ArkivGPTResponse]:
    try:
        response = requests.get(f"{ARKIVGPT_URL}/Summary?GNR=${identifiers.gnr}&BNR=${identifiers.bnr}&SNR=${identifiers.snr}")

        return response 
    except Exception as e:
        logger.error("Failed to communicate with ArkivGPT service", e)
        return []