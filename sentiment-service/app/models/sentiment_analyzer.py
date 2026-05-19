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
    Analyzes sentiment purely from text using NLP.
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
    def _score_to_label(score: float) -> str:
        """Convert a 0.0-1.0 score to a sentiment label."""
        if score >= 0.6:
            return POSITIVE
        elif score >= 0.4:
            return NEUTRAL
        else:
            return NEGATIVE

    def analyze(self, text: str | None) -> tuple[str, float, float]:
        """
        Analyze sentiment purely from text using NLP.

        Args:
            text: Review comment text (can be None or empty)

        Returns:
            Tuple of (sentiment_label, confidence_score, nlp_score)
            - sentiment_label: POSITIVE, NEUTRAL, or NEGATIVE
            - confidence_score: 0.0 to 1.0
            - nlp_score: Pure text sentiment score (0.0 to 1.0)
        """
        # Default to neutral if no text
        if not text or not text.strip():
            return NEUTRAL, 0.5, 0.5

        try:
            nlp_score = self._get_nlp_score(text)
            label = self._score_to_label(nlp_score)
            return label, round(nlp_score, 4), round(nlp_score, 4)

        except Exception as e:
            logger.error(f"NLP analysis failed, falling back to neutral: {e}")
            return NEUTRAL, 0.5, 0.5
