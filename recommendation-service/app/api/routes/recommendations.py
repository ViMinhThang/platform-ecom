from fastapi import APIRouter, Query, Path, BackgroundTasks, HTTPException
from typing import List, Optional
from datetime import datetime
from app.schemas.recommendation import ProductRecommendation
from app.services.recommendation_service import recommendation_service
from ml.training.pipeline import run_training_pipeline
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Store training job status
training_jobs = {}


async def run_training_job(job_id: str):
    """Run training pipeline and update job status."""
    try:
        training_jobs[job_id].update({
            "status": "running",
            "started_at": datetime.utcnow().isoformat()
        })

        await run_training_pipeline()

        training_jobs[job_id].update({
            "status": "completed",
            "completed_at": datetime.utcnow().isoformat()
        })
        logger.info(f"Training job {job_id} completed successfully")

    except Exception as e:
        training_jobs[job_id].update({
            "status": "failed",
            "error": str(e),
            "failed_at": datetime.utcnow().isoformat()
        })
        logger.error(f"Training job {job_id} failed: {e}")


@router.get(
    "/products/{product_id}/similar", response_model=List[ProductRecommendation]
)
async def get_similar_products(
        product_id: int = Path(...), limit: int = Query(10, ge=1, le=50)
):
    return await recommendation_service.get_similar_products(product_id, limit)


@router.get("/users/{user_id}/personalized", response_model=List[ProductRecommendation])
async def get_personalized_feed(
        user_id: int = Path(...),
        limit: int = Query(24, ge=1, le=100),
        page: int = Query(0, ge=0),
):
    return await recommendation_service.get_personalized_feed(user_id, limit, page)


# ========== Training Job Endpoints ==========

@router.post("/training/trigger")
async def trigger_training(
    background_tasks: BackgroundTasks,
    job_id: Optional[str] = None
):
    import uuid
    
    if not job_id:
        job_id = str(uuid.uuid4())
    
    if job_id in training_jobs and training_jobs[job_id].get("status") == "running":
        raise HTTPException(status_code=409, detail=f"Training job {job_id} is already running")
    
    training_jobs[job_id] = {
        "job_id": job_id,
        "status": "pending",
        "triggered_by": "manual",
        "created_at": datetime.utcnow().isoformat(),
        "started_at": None,
        "completed_at": None,
        "failed_at": None,
        "error": None
    }
    
    background_tasks.add_task(run_training_job, job_id)
    logger.info(f"Training job {job_id} triggered manually")
    
    return {
        "job_id": job_id,
        "status": "pending",
        "message": "Training job started successfully",
        "tracking_url": f"/api/v1/recommendations/training/jobs/{job_id}"
    }


@router.get("/training/jobs/{job_id}")
async def get_training_job_status(job_id: str = Path(...)):
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail=f"Training job {job_id} not found")
    
    job = training_jobs[job_id]
    result = {**job}
    
    if job.get("started_at") and job.get("completed_at"):
        from datetime import datetime as dt
        started = dt.fromisoformat(job["started_at"])
        completed = dt.fromisoformat(job["completed_at"])
        result["duration_seconds"] = (completed - started).total_seconds()
    
    return result


@router.get("/training/jobs")
async def list_training_jobs(
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None, enum=["pending", "running", "completed", "failed"])
):
    jobs = list(training_jobs.values())
    
    if status:
        jobs = [j for j in jobs if j.get("status") == status]
    
    jobs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    jobs = jobs[:limit]
    
    return {
        "jobs": jobs,
        "total": len(training_jobs),
        "filtered_count": len(jobs)
    }


@router.delete("/training/jobs/{job_id}")
async def delete_training_job(job_id: str = Path(...)):
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail=f"Training job {job_id} not found")
    
    job = training_jobs[job_id]
    
    if job.get("status") == "running":
        raise HTTPException(
            status_code=409,
            detail="Cannot delete a running job. Wait for it to complete or restart the service."
        )
    
    del training_jobs[job_id]
    
    return {
        "message": f"Training job {job_id} deleted successfully",
        "job_id": job_id,
        "status": "deleted"
    }
