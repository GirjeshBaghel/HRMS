from . import models, schemas
from datetime import date
from typing import List, Optional
from beanie import PydanticObjectId

# Employee CRUD
async def get_employee(employee_id: str) -> Optional[models.Employee]:
    # Check if it's a valid ObjectId
    try:
        oid = PydanticObjectId(employee_id)
        return await models.Employee.get(oid)
    except:
        return None

async def get_employee_by_email(email: str) -> Optional[models.Employee]:
    return await models.Employee.find_one(models.Employee.email == email)

async def get_employee_by_emp_id(emp_id: str) -> Optional[models.Employee]:
    return await models.Employee.find_one(models.Employee.employee_id == emp_id)

async def get_employees(skip: int = 0, limit: int = 100) -> List[models.Employee]:
    return await models.Employee.find_all().skip(skip).limit(limit).to_list()

async def create_employee(employee: schemas.EmployeeCreate) -> models.Employee:
    db_employee = models.Employee(
        employee_id=employee.employee_id,
        name=employee.name,
        email=employee.email,
        department=employee.department
    )
    await db_employee.insert()
    return db_employee

async def delete_employee(employee_id: str) -> bool:
    try:
        oid = PydanticObjectId(employee_id)
        employee = await models.Employee.get(oid)
        if employee:
            await employee.delete()
            return True
        return False
    except:
        return False

# Attendance CRUD
async def get_attendance(skip: int = 0, limit: int = 100) -> List[models.Attendance]:
    return await models.Attendance.find_all().skip(skip).limit(limit).to_list()

async def create_attendance(attendance: schemas.AttendanceCreate) -> models.Attendance:
    # Check if attendance already exists for this employee on this date
    existing = await models.Attendance.find_one(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    )
    
    if existing:
        # Update existing record
        existing.status = attendance.status
        await existing.save()
        return existing
        
    # Get the employee actual document to link if needed, but we storing ref_employee_id as string
    # We really should validate the employee exists first before creating attendance,
    # but that's done in the router usually.
    
    db_attendance = models.Attendance(
        employee_id=attendance.employee_id, # Business ID
        ref_employee_id=attendance.employee_id, # Storing Business ID for now as ref, can be changed to ObjectId if we lookup
        date=attendance.date,
        status=attendance.status,
        employee=None # We are not using the Link field for persistence right now to keep it simple or we need to fetch the employee object
    )
    # Wait, in models.py I defined `employee: Link[Employee]`.
    # If I don't provide it, it might fail validation if required.
    # Let's check models.py again. `employee: Link[Employee]` is required by default in Pydantic.
    # We should probably fetch the employee to set the link.
    
    employee = await models.Employee.find_one(models.Employee.employee_id == attendance.employee_id)
    if not employee:
        raise ValueError("Employee not found") # Should be handled in router
        
    db_attendance.employee = employee
    db_attendance.ref_employee_id = str(employee.id) # Let's store the actual ObjectId string
    
    await db_attendance.insert()
    return db_attendance

async def get_employee_attendance(employee_id: str) -> List[models.Attendance]:
    # Assuming employee_id here is the Business ID
    return await models.Attendance.find(models.Attendance.employee_id == employee_id).to_list()

async def get_attendance_by_date(date: date) -> List[models.Attendance]:
    return await models.Attendance.find(models.Attendance.date == date).to_list()
