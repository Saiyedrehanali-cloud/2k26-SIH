import os
import json
import httpx
from fastapi import APIRouter
from backend.models import ChatRequest, ChatResponse, Citation
from backend.rag.retrieve import retrieve_chunks
from backend.rag.prompts import (
    SYSTEM_PROMPT,
    build_user_prompt,
    compute_confidence,
    format_citations_from_chunks,
    synthesize_local_response,
)

router = APIRouter(prefix="", tags=["Chat"])


async def call_llm_api(prompt: str) -> dict | None:
    """
    Attempts calling OpenAI or compatible endpoint if OPENAI_API_KEY is defined in environment.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    api_base = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(f"{api_base}/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                return json.loads(content)
    except Exception as exc:
        print(f"[LLM Warning] LLM API call failed or timed out: {exc}. Falling back to local synthesizer.")
    return None


from pathlib import Path

DEMO_CACHE_FILE = Path(__file__).resolve().parent.parent / "data" / "demo_cache.json"
_demo_cache = None

def get_demo_cache() -> dict:
    global _demo_cache
    if _demo_cache is None and DEMO_CACHE_FILE.exists():
        try:
            with open(DEMO_CACHE_FILE, "r", encoding="utf-8") as f:
                _demo_cache = json.load(f)
        except Exception as e:
            print(f"[DemoCache Error] Could not load demo cache: {e}")
            _demo_cache = {}
    return _demo_cache or {}

def match_demo_cache(query: str, jurisdiction: str) -> ChatResponse | None:
    cache = get_demo_cache()
    q_lower = query.lower()

    # Check jurisdiction specific items
    items = cache.get(jurisdiction, []) + cache.get("trick_questions", [])
    for item in items:
        trigger = item.get("trigger", "").lower()
        if trigger and (trigger in q_lower or item.get("question", "").lower() in q_lower):
            citations = [
                Citation(source=c["source"], ref_id=c["ref_id"], url=c.get("url"))
                for c in item.get("citations", [])
            ]
            return ChatResponse(
                answer=item["answer"],
                citations=citations,
                confidence=item.get("confidence", "high"),
                jurisdiction=jurisdiction,
                refusal=False
            )
    return None


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Live RAG Endpoint:
    1. Checks offline demo cache for sub-millisecond stage responses.
    2. Retrieves top statutory chunks from ChromaDB filtered by active jurisdiction.
    3. Runs confidence check against similarity thresholds.
    4. Attempts live LLM synthesis if API key is present; otherwise utilizes verified local synthesis.
    """
    jurisdiction = request.jurisdiction.lower().strip()
    query = request.message.strip()

    # Stage Insurance: Check demo cache for instant verified answer
    cached = match_demo_cache(query, jurisdiction)
    if cached:
        return cached

    # Retrieve matching statutory chunks strictly filtered by jurisdiction
    chunks = retrieve_chunks(query=query, jurisdiction=jurisdiction, top_k=3)

    # Check for empty or low confidence refusal
    confidence = compute_confidence(chunks)

    # Attempt LLM API call if key configured
    augmented_prompt = build_user_prompt(
        query=query,
        retrieved_chunks=chunks,
        jurisdiction=jurisdiction,
        classification=request.classification
    )
    
    llm_result = await call_llm_api(augmented_prompt)
    if llm_result and "answer" in llm_result:
        raw_citations = llm_result.get("citations", [])
        citations = [
            Citation(
                source=c.get("source", "Official Statute"),
                ref_id=c.get("ref_id", "REF-AYUSH"),
                url=c.get("url")
            )
            for c in raw_citations
        ]
        # Guarantee citations fallback if LLM omitted them
        if not citations and chunks:
            citations = format_citations_from_chunks(chunks)
            
        return ChatResponse(
            answer=llm_result["answer"],
            citations=citations,
            confidence=llm_result.get("confidence", confidence),
            jurisdiction=jurisdiction,
            refusal=(confidence == "low")
        )

    # Deterministic local statutory synthesizer (Zero-failure stage insurance)
    return synthesize_local_response(
        query=query,
        retrieved_chunks=chunks,
        jurisdiction=jurisdiction,
        classification=request.classification
    )
