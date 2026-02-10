from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import employees, attendance

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight HR Management System API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "*" # For ease of development/demo, restrict in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}
