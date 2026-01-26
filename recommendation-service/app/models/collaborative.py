from typing import List
import random


class CollaborativeModel:
    def get_recommendations(self, user_id: int, limit: int) -> List[int]:
        """
        Matrix Factorization (ALS) based recommendations.
        """
        # Mocking finding relevant products based on user history
        return [random.randint(1, 1000) for _ in range(limit)]
