import io
import pdfplumber
from fastapi import UploadFile

async def extract_text_from_resume(file: UploadFile) -> str:
    """Extract text from uploaded PDF or TXT resume."""
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return _extract_from_pdf(content)
    elif filename.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    else:
        raise ValueError(f"Unsupported file type: {filename}. Please upload PDF or TXT.")

def _extract_from_pdf(content: bytes) -> str:
    # Strategy 1: pdfplumber (works for text-based PDFs)
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            print(f"Pages: {len(pdf.pages)}")
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                print(f"Page {i+1}: '{page_text[:80] if page_text else ''}'")
                if page_text and page_text.strip():
                    text_parts.append(page_text.strip())
    except Exception as e:
        print(f"pdfplumber failed: {e}")

    if text_parts:
        return "\n".join(text_parts)

    # Strategy 2: PyMuPDF fitz (handles more PDF types)
    print("pdfplumber returned empty — trying PyMuPDF fitz...")
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=content, filetype="pdf")
        fitz_parts = []
        for page in doc:
            page_text = page.get_text("text")
            if page_text and page_text.strip():
                fitz_parts.append(page_text.strip())
        doc.close()
        if fitz_parts:
            print(f"fitz extracted {len(fitz_parts)} pages of text")
            return "\n".join(fitz_parts)
    except ImportError:
        print("PyMuPDF not installed — run: pip install PyMuPDF")
    except Exception as e:
        print(f"fitz failed: {e}")

    # Strategy 3: give a helpful error
    raise ValueError(
        "Could not extract text from your PDF. "
        "This usually means the PDF is image-scanned. "
        "Please try: (1) saving your resume as a text-based PDF from Word/Google Docs, "
        "or (2) uploading a .txt version of your resume."
    )
