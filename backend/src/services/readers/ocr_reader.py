from fastapi import UploadFile

from PIL import Image

from io import BytesIO

import pytesseract

from src.services.reader import Reader


class OCRReader(Reader):
    def read(self, file: UploadFile) -> str:
        # TODO: Use fitz for reading digital PDFs; Tesseract for scanned PDFs
        text = self._read_scanned_pdf(file)
        return text
    
    def _read_scanned_pdf(self, file: UploadFile) -> str:
        file.seek(0)
        image = Image.open(BytesIO(file.file.read()))
        image.load()
        text = pytesseract.image_to_string(image)
        return text