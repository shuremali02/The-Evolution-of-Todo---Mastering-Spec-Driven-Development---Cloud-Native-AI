# Hugging Face Spaces compatibility file
# This file exists to satisfy Hugging Face's default app.py expectation
# The actual application is properly defined in the Dockerfile

from app.main import app

# This provides compatibility with Hugging Face Spaces default behavior
# while maintaining our proper application structure
if __name__ == "__main__":
    import uvicorn
    import sys
    # When run directly, start uvicorn server
    uvicorn.run(app, host="0.0.0.0", port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)