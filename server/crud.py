from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

# Employee CRUD
def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employee_by_emp_id(db: Session, emp_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == emp_id).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(
        employee_id=employee.employee_id,
        name=employee.name,
        email=employee.email,
        department=employee.department
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

# Attendance CRUD
def get_attendance(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Attendance).offset(skip).limit(limit).all()

def create_attendance(db: Session, attendance: schemas.AttendanceCreate):
    # Check if attendance already exists for this employee on this date
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    
    if existing:
        # Update existing record
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing
        
    db_attendance = models.Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_employee_attendance(db: Session, employee_id: int):
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()

def get_attendance_by_date(db: Session, date: date):
    return db.query(models.Attendance).filter(models.Attendance.date == date).all()
