import pdfplumber
import io
import logging

logger = logging.getLogger(__name__)

def parse_pdf(file_content: bytes) -> str:
    """
    Extracts text from a PDF file byte stream using pdfplumber.
    """
    extracted_text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    except Exception as e:
        logger.error(f"Failed to parse PDF: {e}")
        raise ValueError("Invalid or corrupted PDF file.")
        
    extracted_text = extracted_text.strip()
    
    # Basic warning if text is too short (likely a scanned image)
    # We could implement pytesseract OCR here if pdf2image and Poppler were installed on the system.
    # For now, we return whatever text was found. 
    if len(extracted_text) < 50:
        logger.warning("Extracted text is very short. This might be a scanned image without a text layer.")
        
    return extracted_text
