import pandas as pd
import numpy as np
from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix
import pickle
import os


def train_collaborative_model():
    # 1. Load interaction data from analytics-service (SQL or CSV export)
    # This is a placeholder for actual data fetching
    # data = pd.read_sql("SELECT user_id, product_id, event_type FROM user_events", conn)

    # Mock data for demonstration
    n_users = 1000
    n_items = 500
    data = pd.DataFrame(
        {
            "user_id": np.random.randint(0, n_users, 5000),
            "product_id": np.random.randint(0, n_items, 5000),
            "weight": np.random.randint(1, 5, 5000),
        }
    )

    # 2. Create sparse matrix
    user_items = csr_matrix((data["weight"], (data["user_id"], data["product_id"])))

    # 3. Train ALS model
    model = AlternatingLeastSquares(factors=64, regularization=0.05, iterations=20)
    model.fit(user_items)

    # 4. Save model and mappings
    os.makedirs("ml/models", exist_ok=True)
    with open("ml/models/collaborative_als.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Collaborative model trained and saved.")


if __name__ == "__main__":
    train_collaborative_model()
