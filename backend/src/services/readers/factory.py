import logging
from fastapi import UploadFile

from src.services.reader import Reader
from src.services.readers.digital_pdf_reader import PdfReader
from src.services.readers.xml_reader import XmlReader
from src.services.readers.ocr_reader import OCRReader

logger = logging.getLogger(__name__)
from fastapi import UploadFile
import fitz

MINIMUM_CHARACTER_THRESHOLD: int = 20

def create_reader(file: UploadFile) -> Reader:
    match file.content_type:
        case "application/pdf":
            if is_digital_file(file):
                return PdfReader()
            else:
                return OCRReader()
        case "image/jpeg" | "image/png":
            return OCRReader()
        case "application/xml" | "text/xml":
            return XmlReader()
        case _:
            logger.warning(f"Unsupported media type: {file.content_type} for file: {file.filename}")
            raise ValueError(f"Unsupported media type: {file.content_type}")

def is_digital_file(file: UploadFile) -> bool:
    text = PdfReader().read(file)
    if len(text) > MINIMUM_CHARACTER_THRESHOLD:
        return True
    
    return False