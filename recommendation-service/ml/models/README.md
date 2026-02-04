# ML Models

This directory stores trained ML models as pickle files.

## Model Files

- `content_similarity.pkl` - TF-IDF + Cosine Similarity matrix for content-based filtering
- `collaborative_als.pkl` - ALS matrix factorization model for collaborative filtering

## Training

Models are trained daily at 2 AM by the training pipeline:
```bash
python -m ml.training.pipeline
```

Or train individually:
```bash
python -m ml.training.train_content_based
python -m ml.training.train_collaborative
```
