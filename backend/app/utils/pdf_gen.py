try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except OSError:
    WEASYPRINT_AVAILABLE = False
    print("WARNING: WeasyPrint system dependencies not found. PDF generation will be mocked.")

from app.models.schemas import UserProfile
from app.rules.deductions import analyze_tax_situation
import io

def generate_pdf_plan(html_content: str) -> bytes:
    """
    Generates a PDF from the provided HTML content.
    """
    if not WEASYPRINT_AVAILABLE:
        print("WeasyPrint not available, returning mock PDF")
        return b"%PDF-1.4 Mock PDF Content (WeasyPrint Missing)"

    pdf_file = io.BytesIO()
    try:
        # Create a base CSS for consistency if needed, but the agent provides styles
        HTML(string=html_content).write_pdf(pdf_file)
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return b"%PDF-1.4 Mock PDF Content (Generation Failed)"
        
    pdf_file.seek(0)
    return pdf_file.read()
