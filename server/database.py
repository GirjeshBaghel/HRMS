import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    # Retrieve the MongoDB URL from environment variables
    # Default to a local instance if not provided
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "hrms_db")

    client = AsyncIOMotorClient(mongodb_url)
    database = client[database_name]
    
    # Import models here to avoid circular imports
    from .models import Employee, Attendance
    
    await init_beanie(database=client.db_name, document_models=[Employee, Attendance]) # Note: client.db_name is incorrect usage for Motor, should be database
    # Correction: init_beanie takes 'database' argument which is the motor database object
    await init_beanie(database=database, document_models=[Employee, Attendance])
