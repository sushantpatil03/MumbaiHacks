import os
import json
import csv
import io

def parse_file_content(file_path: str) -> str:
    """
    Parses file content based on extension and returns a string representation.
    Supports .txt, .csv, .json, .md.
    """
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()

    try:
        if ext == ".txt" or ext == ".md":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        
        elif ext == ".csv":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                reader = csv.reader(f)
                rows = list(reader)
                # Convert CSV to a readable string format
                return "\n".join([",".join(row) for row in rows])
        
        elif ext == ".json":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)
                return json.dumps(data, indent=2)
        
        # Placeholder for PDF - requires pypdf or similar
        elif ext == ".pdf":
            return "[PDF Parsing Not Implemented Yet - Please upload converted text/csv]"
            
        else:
            # Try reading as plain text for unknown extensions
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

    except Exception as e:
        return f"Error parsing file {file_path}: {str(e)}"
