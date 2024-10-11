from fastapi import UploadFile
from src.services.reader import Reader

class XmlReader(Reader):
    def read(self, file: UploadFile) -> str:
        # TODO: Implement reading of XML files.
        content = file.file.read().decode("utf-8")
        return content 