from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date, datetime  
from beanie import PydanticObjectId, Link 
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: str # Business ID (String)

class Attendance(AttendanceBase):
    id: PydanticObjectId = Field(alias="_id")
    employee_id: str 
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {PydanticObjectId: str}

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    name: str # Name
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: PydanticObjectId = Field(alias="_id")
    created_at: datetime
    # In MongoDB we don't automatically populate children relations unless fetched via aggregation
    
    class Config:
        populate_by_name = True
        json_encoders = {PydanticObjectId: str}
