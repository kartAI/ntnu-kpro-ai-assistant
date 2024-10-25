from src.services.reader import Reader
from backend.src.services.readers.structured_pdf_reader import PdfReader
from src.services.readers.xml_reader import XmlReader
from fastapi import UploadFile


def create_reader(file: UploadFile) -> Reader:
    match file.content_type:
        case "application/pdf":
            return PdfReader()
        case "application/xml":
            return XmlReader()
        case _:
            raise ValueError(f"Unsupported media type: {file.content_type}")
