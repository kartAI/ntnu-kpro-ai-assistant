from typing import Protocol
from fastapi import UploadFile


class Reader(Protocol):
    def read(self, file: UploadFile) -> str: ...
