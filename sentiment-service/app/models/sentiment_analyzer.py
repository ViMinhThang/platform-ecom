import logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

logger = logging.getLogger(__name__)

POSITIVE = "POSITIVE"
NEUTRAL = "NEUTRAL"
NEGATIVE = "NEGATIVE"


class SentimentAnalyzer:
    """
    Loads a HuggingFace sentiment model from a local directory or model ID.
    Combines NLP text analysis with the star rating for a weighted sentiment score.
    """

    def __init__(self, model_path: str):
        """
        Args:
            model_path: Local directory path (e.g., ./models/my-sentiment-model)
                        or a HuggingFace model ID (e.g., distilbert-base-uncased-finetuned-sst-2-english)
        """
        logger.info(f"Loading sentiment model from: {model_path}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.model.eval()

        # Detect number of labels to determine model type
        self.num_labels = self.model.config.num_labels
        logger.info(f"Model loaded successfully. Number of labels: {self.num_labels}")

    def _get_nlp_score(self, text: str) -> float:
        """
        Run inference on the text and return a sentiment score from 0.0 (most negative) to 1.0 (most positive).
        Uses the model's id2label config to correctly map label indices regardless of model-specific ordering.
        """
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1).squeeze()

        # Try to use id2label from model config for accurate label mapping
        id2label = getattr(self.model.config, "id2label", None)

        if id2label:
            # Build score from label names (handles any label ordering)
            pos_prob = 0.0
            neu_prob = 0.0
            neg_prob = 0.0

            for idx, label in id2label.items():
                label_upper = label.upper()
                prob = probabilities[int(idx)].item()

                if "POS" in label_upper:
                    pos_prob += prob
                elif "NEU" in label_upper:
                    neu_prob += prob
                elif "NEG" in label_upper:
                    neg_prob += prob

            # Score: POSITIVE=1.0, NEUTRAL=0.5, NEGATIVE=0.0
            return pos_prob * 1.0 + neu_prob * 0.5 + neg_prob * 0.0

        # Fallback for models without id2label
        if self.num_labels == 2:
            return probabilities[1].item()
        elif self.num_labels == 3:
            return probabilities[2].item() * 1.0 + probabilities[1].item() * 0.5
        elif self.num_labels == 5:
            weighted_score = sum(probabilities[i].item() * (i + 1) for i in range(5))
            return (weighted_score - 1.0) / 4.0
        else:
            return probabilities[-1].item()

    @staticmethod
    def _normalize_rating(rating: int) -> float:
        """Normalize a 1-5 star rating to a 0.0-1.0 scale."""
        return (rating - 1) / 4.0

    @staticmethod
    def _score_to_label(score: float) -> str:
        """Convert a 0.0-1.0 score to a sentiment label."""
        if score >= 0.6:
            return POSITIVE
        elif score >= 0.4:
            return NEUTRAL
        else:
            return NEGATIVE

    @staticmethod
    def _calculate_rating_sentiment(rating: int) -> tuple[str, float, None]:
        """Fallback: calculate sentiment from rating only."""
        score = SentimentAnalyzer._normalize_rating(rating)
        label = SentimentAnalyzer._score_to_label(score)
        return label, score, None

    def analyze(self, text: str | None, rating: int) -> tuple[str, float, float | None]:
        """
        Analyze sentiment by combining NLP text analysis with the star rating.

        Args:
            text: Review comment text (can be None or empty)
            rating: Star rating (1-5)

        Returns:
            Tuple of (sentiment_label, confidence_score, nlp_score)
            - sentiment_label: POSITIVE, NEUTRAL, or NEGATIVE
            - confidence_score: 0.0 to 1.0
            - nlp_score: Pure text sentiment score (0.0 to 1.0) or None
        """
        # Fallback to rating-based sentiment if no text
        if not text or not text.strip():
            return self._calculate_rating_sentiment(rating)

        try:
            nlp_score = self._get_nlp_score(text)
            rating_score = self._normalize_rating(rating)

            # Weighted combination: 60% NLP, 40% rating
            final_score = 0.6 * nlp_score + 0.4 * rating_score

            label = self._score_to_label(final_score)
            return label, round(final_score, 4), round(nlp_score, 4)

        except Exception as e:
            logger.error(f"NLP analysis failed, falling back to rating-based: {e}")
            return self._calculate_rating_sentiment(rating)
