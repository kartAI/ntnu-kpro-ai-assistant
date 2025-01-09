from io import BytesIO
from fastapi import UploadFile
import pymupdf
from tempfile import NamedTemporaryFile
from src.services.reader import Reader

from io import BytesIO
from fastapi import UploadFile
import fitz  # pymupdf is imported as fitz
from src.services.reader import Reader


class PdfReader(Reader):
    def read(self, file: UploadFile) -> str:
        # Read the file content
        contents = file.read()  # Ensure it's an async read
        if not contents:
            raise ValueError("Empty file provided")

        # Use BytesIO to open the PDF document
        bytes_io = BytesIO(contents).getvalue()
        with fitz.open(stream=bytes_io, filetype="pdf") as doc:
            text = ""
            for page in doc:  # Iterate through the document pages
                text += page.get_text()
        return text
