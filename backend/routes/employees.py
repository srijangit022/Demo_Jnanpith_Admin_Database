from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
import uuid
from typing import List
import csv
import io
from fastapi.responses import Response

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.post("/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.get("/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    return employees

@router.get("/export")
def export_employee_excel(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    if not employees:
        raise HTTPException(status_code=404, detail="No employees found")
        
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        "Employee ID", "Employee Code", "First Name", "Last Name", 
        "Department", "Position", "Date of Birth", "Blood Group", "Joining Date",
        "Contact Number", "Monthly Salary",
        "Jan Paid", "Feb Paid", "Mar Paid", "Apr Paid", "May Paid", "Jun Paid",
        "Jul Paid", "Aug Paid", "Sep Paid", "Oct Paid", "Nov Paid", "Dec Paid"
    ])
    
    for e in employees:
        writer.writerow([
            e.id, e.emp_id, e.first_name, e.last_name,
            e.department, e.position, e.birth_date, e.blood_group, e.joining_date,
            e.contact_number, e.salary,
            e.salary_paid_jan, e.salary_paid_feb, e.salary_paid_mar,
            e.salary_paid_apr, e.salary_paid_may, e.salary_paid_jun,
            e.salary_paid_jul, e.salary_paid_aug, e.salary_paid_sep,
            e.salary_paid_oct, e.salary_paid_nov, e.salary_paid_dec
        ])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=Employees_Export.csv"
    return response

@router.get("/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
        
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}

@router.post("/{employee_id}/photo", response_model=schemas.Employee)
def upload_employee_photo(employee_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Ensure uploads dir exists
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate unique filename
    filename_str = file.filename or "photo.jpg"
    ext = filename_str.split('.')[-1] if '.' in filename_str else 'jpg'
    filename = f"emp_{employee_id}_{str(uuid.uuid4().hex)[:8]}.{ext}"
    file_path = os.path.join(uploads_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_employee.photo_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(db_employee)
    return db_employee
