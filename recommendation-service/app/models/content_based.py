from typing import List
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os


class ContentBasedModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.similarity_matrix = None
        self.product_ids = []
        self.model_path = "ml/models/content_similarity.pkl"

        if os.path.exists(self.model_path):
            self.load_model()

    def train(self, products_df: pd.DataFrame):
        """
        products_df should have 'id', 'name', 'description', 'category'
        """
        # Combine text features
        products_df["content"] = (
            products_df["name"]
            + " "
            + products_df["description"]
            + " "
            + products_df["category"]
        )

        # Compute TF-IDF
        tfidf_matrix = self.vectorizer.fit_transform(products_df["content"])

        # Compute Cosine Similarity
        self.similarity_matrix = cosine_similarity(tfidf_matrix)
        self.product_ids = products_df["id"].tolist()

        # Save model
        os.makedirs("ml/models", exist_ok=True)
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

    def get_similar(self, product_id: int, limit: int) -> List[int]:
        if self.similarity_matrix is None or product_id not in self.product_ids:
            return []

        idx = self.product_ids.index(product_id)
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Skip the product itself (index 0)
        sim_scores = sim_scores[1 : limit + 1]

        return [self.product_ids[i] for i, score in sim_scores]
