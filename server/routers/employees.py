from fastapi import APIRouter, HTTPException, status
from typing import List
from .. import crud, schemas

router = APIRouter(
    prefix="/employees",
    tags=["employees"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: schemas.EmployeeCreate):
    db_employee = await crud.get_employee_by_email(email=employee.email)
    if db_employee:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_employee_id = await crud.get_employee_by_emp_id(emp_id=employee.employee_id)
    if db_employee_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
        
    return await crud.create_employee(employee=employee)

@router.get("/", response_model=List[schemas.Employee])
async def read_employees(skip: int = 0, limit: int = 100):
    employees = await crud.get_employees(skip=skip, limit=limit)
    return employees

@router.get("/{employee_id}", response_model=schemas.Employee)
async def read_employee(employee_id: str):
    # Here employee_id can be ObjectId or Business ID
    # Let's try to match by Business ID first as that was the previous behavior for external ID reference?
    # No, usually in REST /resource/{id} refers to the internal ID.
    # But checking crud.py: `get_employee` tries `PydanticObjectId(employee_id)`.
    # Failing that, we should try `get_employee_by_emp_id`?
    # Let's check crud.py implementation of `get_employee` again:
    # `try: oid = PydanticObjectId; return await Employee.get(oid)`
    # It returns None if invalid ObjectId.
    
    db_employee = await crud.get_employee(employee_id=employee_id)
    if not db_employee:
        # Fallback: try by business ID
        db_employee = await crud.get_employee_by_emp_id(emp_id=employee_id)
        
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    success = await crud.delete_employee(employee_id=employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return None
