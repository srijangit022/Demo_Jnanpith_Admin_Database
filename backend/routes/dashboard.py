from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import date, timedelta
from typing import List

from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/birthdays/today")
def get_todays_birthdays(db: Session = Depends(get_db)):
    today = date.today()
    current_month = today.month
    current_day = today.day

    students = db.query(models.Student).filter(
        extract('month', models.Student.date_of_birth) == current_month,
        extract('day', models.Student.date_of_birth) == current_day
    ).all()

    employees = db.query(models.Employee).filter(
        extract('month', models.Employee.birth_date) == current_month,
        extract('day', models.Employee.birth_date) == current_day
    ).all()

    student_birthdays = [
        {
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "type": "Student",
            "grade": s.grade
        } for s in students
    ]

    employee_birthdays = [
        {
            "id": e.id,
            "name": f"{e.first_name} {e.last_name}",
            "type": "Employee",
            "department": e.department,
            "position": e.position
        } for e in employees
    ]

    return student_birthdays + employee_birthdays

@router.get("/holidays/upcoming")
def get_upcoming_holidays(db: Session = Depends(get_db)):
    today = date.today()
    next_week = today + timedelta(days=7)

    # Get holidays that start between today and next week, or are already ongoing (start_date <= next_week AND end_date >= today)
    upcoming = db.query(models.Holiday).filter(
        models.Holiday.start_date <= next_week,
        models.Holiday.end_date >= today
    ).order_by(models.Holiday.start_date).all()
    
    return upcoming

@router.get("/attendance/today")
def get_todays_attendance_summary(db: Session = Depends(get_db)):
    today = date.today()
    
    # Get total students per grade
    from sqlalchemy import func
    grade_totals = db.query(models.Student.grade, func.count(models.Student.id)).group_by(models.Student.grade).all()
    total_map = {grade: count for grade, count in grade_totals}
    
    # Get present students per grade today
    # Filter StudentAttendance by today and status == 'Present', join with Student to get grade
    present_counts = db.query(models.Student.grade, func.count(models.StudentAttendance.id))\
        .join(models.StudentAttendance, models.Student.id == models.StudentAttendance.student_id)\
        .filter(models.StudentAttendance.date == today)\
        .filter(models.StudentAttendance.status == 'Present')\
        .group_by(models.Student.grade).all()
        
    present_map = {grade: count for grade, count in present_counts}
    
    summary = []
    # If a class hasn't taken attendance, we might assume 0 or handle it gracefully. 
    # Since our system defaults to 'Present', if they haven't explicitly saved attendance today, 
    # there won't be records in StudentAttendance. We will return 0 present to indicate it's not marked,
    # or we can assume all present. Let's assume 0 if not marked, so it shows up as an alert.
    for grade, total in total_map.items():
        summary.append({
            "grade": grade,
            "total_students": total,
            "present_students": present_map.get(grade, 0)
        })
        
    # Sort by grade name roughly
    summary.sort(key=lambda x: x['grade'])
    return summary
