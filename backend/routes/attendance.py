from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import io
import csv

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.get("/class/{grade}", response_model=List[schemas.StudentAttendanceResponse])
def get_class_attendance(grade: str, query_date: date = Query(alias="date"), db: Session = Depends(get_db)):
    students = db.query(models.Student).filter(models.Student.grade == grade).all()
    
    attendances = db.query(models.StudentAttendance).filter(
        models.StudentAttendance.date == query_date
    ).all()
    
    attendance_map = {a.student_id: a.status for a in attendances}
    
    result = []
    for s in students:
        result.append({
            "student_id": s.id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "status": attendance_map.get(s.id, "Present")
        })
    return result

@router.post("/class/{grade}")
def save_class_attendance(grade: str, data: schemas.ClassAttendanceSubmit, db: Session = Depends(get_db)):
    for record in data.records:
        existing = db.query(models.StudentAttendance).filter(
            models.StudentAttendance.student_id == record.student_id,
            models.StudentAttendance.date == data.date
        ).first()
        
        if existing:
            existing.status = record.status
        else:
            new_attendance = models.StudentAttendance(
                student_id=record.student_id,
                date=data.date,
                status=record.status
            )
            db.add(new_attendance)
            
    db.commit()
    return {"message": "Attendance saved successfully"}

@router.get("/export/{grade}")
def export_class_attendance(grade: str, query_date: date = Query(alias="date"), db: Session = Depends(get_db)):
    students = db.query(models.Student).filter(models.Student.grade == grade).all()
    attendances = db.query(models.StudentAttendance).filter(
        models.StudentAttendance.date == query_date
    ).all()
    attendance_map = {a.student_id: a.status for a in attendances}
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Student ID', 'First Name', 'Last Name', 'Grade', 'Date', 'Status'])
    
    for s in students:
        status = attendance_map.get(s.id, "Present")
        writer.writerow([s.id, s.first_name, s.last_name, s.grade, query_date.strftime("%Y-%m-%d"), status])
        
    output.seek(0)
    
    headers = {
        'Content-Disposition': f'attachment; filename="attendance_{grade.replace(" ", "_")}_{query_date.strftime("%Y-%m-%d")}.csv"'
    }
    
    return Response(content=output.getvalue(), media_type="text/csv", headers=headers)
