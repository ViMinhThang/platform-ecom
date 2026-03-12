from pydantic import BaseModel, Field
from typing import Optional


class SentimentRequest(BaseModel):
    text: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)


class SentimentResponse(BaseModel):
    sentiment: str  # POSITIVE, NEUTRAL, NEGATIVE
    score: float  # 0.0 - 1.0 confidence score
    nlp_score: Optional[float] = None  # Pure text sentiment score (0.0 to 1.0)


class BatchSentimentRequest(BaseModel):
    items: list[SentimentRequest]


class BatchSentimentResponse(BaseModel):
    results: list[SentimentResponse]
