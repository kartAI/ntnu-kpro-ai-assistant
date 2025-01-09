import logging
from PIL import Image, UnidentifiedImageError
from fastapi import UploadFile
from io import BytesIO
import pytesseract


from src.services.reader import Reader

logger = logging.getLogger(__name__)


class OCRReader(Reader):
    def __init__(self, languages: list[str] = ["eng", "nor"]) -> None:
        self.languages: str = "+".join(languages)

    def read(self, file: UploadFile) -> str:
        text = self._read_scanned_pdf(file)
        return text

    def _read_scanned_pdf(self, file: UploadFile) -> str:
        file.seek(0)
        try:
            image = Image.open(BytesIO(file.file.read()))
            image.load()
            text = pytesseract.image_to_string(image)

        except UnidentifiedImageError as e:
            logger.error(f"OCR failed to load image with error: {e}")
            raise ValueError("Document corrupt")
        return text
