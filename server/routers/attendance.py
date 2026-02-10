from fastapi import APIRouter, HTTPException, status
from typing import List
from .. import crud, schemas

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: schemas.AttendanceCreate):
    # Verify employee exists - handled in crud.py or here?
    # crud.create_attendance checks for existing attendance.
    # It also needs to link employee.
    
    # Ideally, we should check existence here to return 404 properly if employee not found.
    # But let's let crud handle it and maybe catch exception?
    # Currently crud.create_attendance raises ValueError if employee not found.
    
    try:
        return await crud.create_attendance(attendance=attendance)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/", response_model=List[schemas.Attendance])
async def read_attendance_by_date(date: str = None):
    if date:
        from datetime import datetime
        try:
            query_date = datetime.strptime(date, "%Y-%m-%d").date()
            return await crud.get_attendance_by_date(date=query_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    return await crud.get_attendance()

@router.get("/{employee_id}", response_model=List[schemas.Attendance])
async def read_attendance(employee_id: str):
    # Check if employee exists
    db_employee = await crud.get_employee_by_emp_id(emp_id=employee_id)
    if not db_employee:
        # Try finding by ObjectId
        db_employee = await crud.get_employee(employee_id=employee_id)
        
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    return await crud.get_employee_attendance(employee_id=db_employee.employee_id)
