from io import BytesIO
from PIL import Image
from fastapi import UploadFile
from pytesseract import image_to_string

from src.services.reader import Reader


class OCRReader(Reader):
    def __init__(self, languages: list[str]=["eng", "nor"]) -> None:
        self.languages: str = "+".join(languages)
    
    def read(self, file: UploadFile) -> str:
        text = self._read_scanned_pdf(file)
        return text
    
    def _read_scanned_pdf(self, file: UploadFile) -> str:
        file.seek(0)
        image = Image.open(BytesIO(file.file.read()))
        image.load()
        text = image_to_string(image, lang=self.languages)
        return text