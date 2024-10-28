from fastapi import UploadFile

from src.services.reader import Reader


class PdfReader(Reader):
    def read(self, file: UploadFile) -> str:
        # TODO USE fitz TO READ PDF FILES THAT ARE DIGITALIZED USE Tesseract TO READ PDF FILES THAT ARE SCANNED
        text = ""
        return text
