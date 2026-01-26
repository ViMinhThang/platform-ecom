from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import recommendations
import uvicorn

app = FastAPI(
    title="Recommendation Service",
    description="ML-powered recommendation engine for E-commerce platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"]
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8200, reload=True)
