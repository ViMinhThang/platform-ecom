import logging
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.sentiment import (
    SentimentRequest,
    SentimentResponse,
    BatchSentimentRequest,
    BatchSentimentResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()

# Will be set during app lifespan startup
analyzer = None


def set_analyzer(sentiment_analyzer):
    global analyzer
    analyzer = sentiment_analyzer


@router.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """Analyze the sentiment of a single review text combined with its star rating."""
    if analyzer is None:
        raise HTTPException(status_code=503, detail="Sentiment model not loaded yet")

    label, score, nlp_score = analyzer.analyze(request.text, request.rating)

    return SentimentResponse(sentiment=label, score=score, nlp_score=nlp_score)


@router.post("/analyze/batch", response_model=BatchSentimentResponse)
async def analyze_sentiment_batch(request: BatchSentimentRequest):
    """Analyze the sentiment of multiple reviews in one request."""
    if analyzer is None:
        raise HTTPException(status_code=503, detail="Sentiment model not loaded yet")

    results = []
    for item in request.items:
        label, score, nlp_score = analyzer.analyze(item.text, item.rating)
        results.append(SentimentResponse(sentiment=label, score=score, nlp_score=nlp_score))

    return BatchSentimentResponse(results=results)
