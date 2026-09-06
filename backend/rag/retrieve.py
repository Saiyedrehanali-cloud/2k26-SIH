"""
RAG Retrieval Module for IP-SAKTI Sahayak (Ministry of Ayush)
Performs similarity search against local Chroma vector store, strictly filtered
by the active jurisdiction metadata ('india' or 'international') to prevent
cross-jurisdiction hallucination or legal conflation.
"""

from pathlib import Path
from typing import Dict, List, Any, Optional
import chromadb

DEFAULT_PERSIST_DIR = Path(__file__).resolve().parent.parent / "data" / "chroma_db"
COLLECTION_NAME = "ayush_legal_corpus"

_client = None
_collection = None


def get_collection(persist_dir: Path = DEFAULT_PERSIST_DIR):
    """
    Lazy singleton loader for Chroma persistent collection.
    """
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=str(persist_dir))
        _collection = _client.get_or_create_collection(name=COLLECTION_NAME)
    return _collection


def retrieve_chunks(
    query: str,
    jurisdiction: str = "india",
    top_k: int = 3,
    persist_dir: Path = DEFAULT_PERSIST_DIR
) -> List[Dict[str, Any]]:
    """
    Retrieves the top_k most relevant statutory chunks strictly filtered by jurisdiction.
    
    Args:
        query: Natural language query (e.g. "Can I patent an Ashwagandha formulation?")
        jurisdiction: 'india' or 'international'
        top_k: Number of chunks to retrieve
        persist_dir: Path to chroma_db storage
        
    Returns:
        List of dicts containing text, metadata, distance, and similarity score.
    """
    collection = get_collection(persist_dir)
    jurisdiction_clean = jurisdiction.strip().lower()
    
    # Query Chroma with exact jurisdiction filter
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where={"jurisdiction": jurisdiction_clean}
    )

    retrieved = []
    if not results or not results["documents"] or not results["documents"][0]:
        return retrieved

    docs = results["documents"][0]
    metas = results["metadatas"][0] if results["metadatas"] else [{}] * len(docs)
    distances = results["distances"][0] if "distances" in results and results["distances"] else [0.5] * len(docs)
    ids = results["ids"][0] if results["ids"] else [f"chunk_{i}" for i in range(len(docs))]

    for doc_text, meta, dist, chunk_id in zip(docs, metas, distances, ids):
        # Compute normalized similarity from L2 distance (or cosine distance depending on metric)
        similarity = 1.0 / (1.0 + float(dist))
        retrieved.append({
            "id": chunk_id,
            "text": doc_text,
            "metadata": meta,
            "distance": float(dist),
            "similarity": similarity
        })

    return retrieved


if __name__ == "__main__":
    import sys
    test_query = sys.argv[1] if len(sys.argv) > 1 else "Ashwagandha patent eligibility"
    test_jur = sys.argv[2] if len(sys.argv) > 2 else "india"
    print(f"--- Running test retrieval: query='{test_query}', jurisdiction='{test_jur}' ---")
    chunks = retrieve_chunks(test_query, jurisdiction=test_jur, top_k=2)
    for i, c in enumerate(chunks):
        print(f"\n[Result #{i+1}] (Sim: {c['similarity']:.3f}, Dist: {c['distance']:.3f})")
        print(f"Ref: {c['metadata'].get('section_ref')} | Doc: {c['metadata'].get('title')}")
        print(f"URL: {c['metadata'].get('url')}")
        print(f"Snippet:\n{c['text'][:300]}...")
