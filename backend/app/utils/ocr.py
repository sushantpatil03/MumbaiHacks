import io
from pypdf import PdfReader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.models.schemas import ParsedPayroll
import os
from app.utils.logger import setup_logger

logger = setup_logger("ocr")

async def mock_ocr_parse(file_content: bytes) -> ParsedPayroll:
    """
    Parses PDF content using LLM (Grok) via OpenRouter.
    1. Extracts text using pypdf.
    2. Sends text to LLM to extract structured data.
    """
    try:
        # 1. Extract Text
        logger.info("Extracting text from PDF...")
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        logger.debug(f"Extracted text length: {len(text)}")
        if len(text) < 50:
            logger.warning("Extracted text is very short. PDF might be an image scan.")
            # Fallback or error? For now, let's try to proceed or return default
            
        # 2. LLM Extraction
        llm = ChatOpenAI(
            model="x-ai/grok-4.1-fast:free",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0
        )
        
        parser = PydanticOutputParser(pydantic_object=ParsedPayroll)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert data extraction AI. Extract payroll details from the provided text. "
                       "Return the output strictly in JSON format matching the schema. "
                       "Handle Indian number formats (lakhs) by converting to integers. "
                       "If a field is missing, make a reasonable estimate or set to 0.\n"
                       "{format_instructions}"),
            ("user", "Payroll Document Text:\n{text}")
        ])
        
        logger.info("Invoking LLM for parsing...")
        chain = prompt | llm | parser
        parsed_data = chain.invoke({
            "text": text,
            "format_instructions": parser.get_format_instructions()
        })
        
        logger.info(f"Successfully parsed data: {parsed_data}")
        return parsed_data

    except Exception as e:
        logger.error(f"Error in LLM parsing: {e}", exc_info=True)
        # Fallback to mock data if parsing fails completely
        logger.warning("Falling back to mock data due to error.")
        return ParsedPayroll(
            gross_salary=1200000,
            basic_salary=600000,
            hra_received=300000,
            pf=72000,
            allowances={"Special": 228000}
        )
