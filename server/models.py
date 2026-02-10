from typing import Optional, List
from beanie import Document, Link
from pydantic import Field
from datetime import datetime, date
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

class Employee(Document):
    employee_id: str = Field(..., unique=True)
    name: str
    email: str = Field(..., unique=True)
    department: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "employees"

class Attendance(Document):
    employee_id: str  # Storing the string ID of the employee or the business employee_id
    # To keep it simple and relational-like, we can store the business employee_id or the Link.
    # Given the previous schema used integer IDs, we'll stick to referencing by the unique employee_id string 
    # or the object ID. Let's use the unique business `employee_id` string for easier querying if that was the pattern,
    # OR better yet, use Beanie's Link feature if we want actual references.
    # However, the previous code filtered by `employee_id` (int PK). 
    # The CRUD logic passed `attendance.employee_id`.
    # Let's align with the previous logic: `employee_id` field in Attendance referred to Employee.id.
    # In MongoDB, we usually use the _id. 
    # Let's store the `ref_employee_id` (ObjectId string) or keep it simple.
    
    # Let's use the business `employee_id` (String) as the foreign key equivalent since it's unique.
    # It makes manual entry easier too.
    ref_employee_id: str # This will store the Employee's OID or Business ID.
    # Wait, the previous schemas had:
    # class AttendanceCreate(AttendanceBase):
    #    employee_id: int
    # And Employee had `employee_id` (String) AND `id` (Integer PK).
    # Since we are dropping the Integer PK, we should rely on the unique `employee_id` string or the `_id`.
    # Let's reference by the ObjectID of the Employee document to be more "Mongo-like".
    
    employee: Link[Employee]
    date: date
    status: AttendanceStatus
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "attendance"
