from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from . import models
from .database import engine
from .routes import students, employees, dashboard, holidays, vendors, classes, attendance, analytics, owner

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jnanpith Shikshayatan System", description="School Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students)
app.include_router(employees)
app.include_router(dashboard, prefix="/api")
app.include_router(holidays)
app.include_router(vendors)
app.include_router(classes)
app.include_router(attendance)
app.include_router(analytics)
app.include_router(owner)

# Serve the frontend statically
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),"frontend")
app.mount("/static", StaticFiles(directory=frontend_path), name="static")


# Serve the uploads directory
uploads_path = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

@app.get("/")
def read_root():
    # Serve index.html at root route
    return FileResponse(os.path.join(frontend_path, "index.html"))
