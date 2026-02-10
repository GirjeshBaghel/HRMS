from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from . import database
from .routers import employees, attendance
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to the database
    await database.init_db()
    yield
    # Shutdown: Close connections if needed (Motor handles this automatically largely)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight HR Management System API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    os.getenv("ALLOWED_ORIGIN", "*") # Allow configuring from env
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
async def read_root():
    return {"message": "Welcome to HRMS Lite API"}
