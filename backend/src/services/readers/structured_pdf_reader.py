from fastapi import UploadFile
import fitz  # PyMuPDF
import pytesseract
from tempfile import NamedTemporaryFile

from src.services.reader import Reader

class PdfReader(Reader):
    async def read(self, file: UploadFile) -> str:
        text = ""

        # Save the uploaded file to a temporary file
        with NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(await file.read())
            tmp_file_path = tmp_file.name

        # Open the PDF document with PyMuPDF (fitz)
        doc = fitz.open(tmp_file_path)  # Open the document
        for page in doc:  # Iterate over pages
            page_text = page.get_text()  # Get plain text from the page
            
            if page_text.strip():  # If there is embedded text
                text += page_text
            else:
                # Render the page as an image and use OCR
                pix = page.get_pixmap()  # Render page to image (pixmap)
                ocr_text = pytesseract.image_to_string(pix.tobytes("png"))  # Use OCR on the rendered image
                text += ocr_text

            text += "\n\n"  # Separate pages

        doc.close()  # Close the document
        return text
