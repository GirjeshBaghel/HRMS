from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, database

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    db_employee = crud.get_employee(db, employee_id=attendance.employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    return crud.create_attendance(db=db, attendance=attendance)

@router.get("/", response_model=List[schemas.Attendance])
def read_attendance_by_date(date: str = None, db: Session = Depends(get_db)):
    if date:
        from datetime import datetime
        try:
            query_date = datetime.strptime(date, "%Y-%m-%d").date()
            return crud.get_attendance_by_date(db, date=query_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    return crud.get_attendance(db)

@router.get("/{employee_id}", response_model=List[schemas.Attendance])
def read_attendance(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    return crud.get_employee_attendance(db, employee_id=employee_id)
