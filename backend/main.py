import os
import sys
from pathlib import Path

# Add project root to sys.path so 'backend' package imports work cleanly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.routers import chat, classify

load_dotenv()

app = FastAPI(
    title="IP-SAKTI Sahayak Backend API",
    description="RAG-based Legal AI Assistant for AYUSH, Patents, Biodiversity, and Traditional Knowledge",
    version="1.0.0"
)

# Configure CORS to allow frontend Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router)
app.include_router(classify.router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "IP-SAKTI Sahayak",
        "jurisdictions_supported": ["india", "international"],
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
