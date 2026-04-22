import logging
import os
import pickle
from typing import List, Tuple

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.config import settings


logger = logging.getLogger(__name__)


class ContentBasedModel:
    def __init__(self, model_path: str | None = None):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.similarity_matrix = None
        self.product_ids: List[int] = []
        self.model_path = model_path or settings.content_model_path
        self.legacy_model_path = os.path.join("app", "ml", "models", "content_similarity.pkl")

        if os.path.exists(self.model_path):
            self.load_model()
        elif os.path.exists(self.legacy_model_path):
            # Backward-compatible fallback so existing deployments keep working.
            self.model_path = self.legacy_model_path
            self.load_model()
            logger.warning(f"Loaded legacy content model path: {self.legacy_model_path}")

    def train(self, products_df: pd.DataFrame):
        """
        products_df should have 'id', 'name', 'description', 'category'
        """
        products_df["content"] = (
            products_df["name"]
            + " "
            + products_df["description"]
            + " "
            + products_df["category"]
        )

        tfidf_matrix = self.vectorizer.fit_transform(products_df["content"])

        self.similarity_matrix = cosine_similarity(tfidf_matrix)
        self.product_ids = products_df["id"].tolist()

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, "wb") as f:
            pickle.dump(
                {
                    "vectorizer": self.vectorizer,
                    "similarity_matrix": self.similarity_matrix,
                    "product_ids": self.product_ids,
                },
                f,
            )

    def load_model(self):
        with open(self.model_path, "rb") as f:
            data = pickle.load(f)
            self.vectorizer = data["vectorizer"]
            self.similarity_matrix = data["similarity_matrix"]
            self.product_ids = data["product_ids"]

    def get_similar(self, product_id: int, limit: int) -> List[Tuple[int, float]]:
        if self.similarity_matrix is None or product_id not in self.product_ids:
            return []

        idx = self.product_ids.index(product_id)
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        recommendations: List[Tuple[int, float]] = []
        for item_idx, similarity_score in sim_scores:
            if item_idx == idx:
                continue

            recommendations.append((int(self.product_ids[item_idx]), float(similarity_score)))
            if len(recommendations) >= limit:
                break

        return recommendations
