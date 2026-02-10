from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime
from .models import AttendanceStatus

# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: int

class Attendance(AttendanceBase):
    id: int
    employee_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    attendance_records: List[Attendance] = []

    class Config:
        from_attributes = True
