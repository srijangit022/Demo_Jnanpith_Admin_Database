from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    # 1. Total Active Students
    total_students = db.query(func.count(models.Student.id)).scalar() or 0
    
    # 2. Total Employed Staff
    total_employees = db.query(func.count(models.Employee.id)).scalar() or 0
    
    # Financials (3, 4, 5, 9, 10)
    students = db.query(models.Student).all()
    employees = db.query(models.Employee).all()
    
    monthly_revenue = [0] * 12
    total_revenue = 0
    total_outstanding = 0
    defaulter_count = 0
    
    for s in students:
        # Calculate revenue and monthly distribution
        months_paid = [
            s.fee_paid_jan, s.fee_paid_feb, s.fee_paid_mar, s.fee_paid_apr,
            s.fee_paid_may, s.fee_paid_jun, s.fee_paid_jul, s.fee_paid_aug,
            s.fee_paid_sep, s.fee_paid_oct, s.fee_paid_nov, s.fee_paid_dec
        ]
        
        for i, amt in enumerate(months_paid):
            if amt:
                monthly_revenue[i] += amt
                total_revenue += amt
                
        if s.admission_fees_paid:
            total_revenue += s.admission_fees_paid
            
        # Calculate outstanding / due
        due = 0
        if s.admission_fees_due and s.admission_fees_due > 0:
            due += s.admission_fees_due
            
        # Optional: Calculate monthly dues (assuming monthly_fee * past months - paid)
        # For simplicity, we just use the explicitly recorded admission_fees_due 
        # and look if total paid is extremely low compared to what's expected.
        expected_monthly_so_far = (s.monthly_fees or 0) * 12 # Simplified to annual
        paid_monthly = sum(m for m in months_paid if m)
        if expected_monthly_so_far > paid_monthly:
            due += (expected_monthly_so_far - paid_monthly)
            
        total_outstanding += due
        if due > 0:
            defaulter_count += 1
            
    monthly_expenses = [0] * 12
    total_expenses = 0
    
    for e in employees:
        months_paid = [
            e.salary_paid_jan, e.salary_paid_feb, e.salary_paid_mar, e.salary_paid_apr,
            e.salary_paid_may, e.salary_paid_jun, e.salary_paid_jul, e.salary_paid_aug,
            e.salary_paid_sep, e.salary_paid_oct, e.salary_paid_nov, e.salary_paid_dec
        ]
        
        for i, amt in enumerate(months_paid):
            if amt:
                monthly_expenses[i] += amt
                total_expenses += amt
                
    net_balance = total_revenue - total_expenses
    
    # 8. Today's Global Attendance Rate
    today = date.today()
    present_today = db.query(func.count(models.StudentAttendance.id)).filter(
        models.StudentAttendance.date == today,
        models.StudentAttendance.status == 'Present'
    ).scalar() or 0
    
    # 11. Class-wise Enrollment
    class_enrollment = db.query(models.Student.grade, func.count(models.Student.id)).group_by(models.Student.grade).all()
    class_enrollment_map = {g: c for g, c in class_enrollment if g}
    
    # 12. Department-wise Staff
    department_staff = db.query(models.Employee.department, func.count(models.Employee.id)).group_by(models.Employee.department).all()
    department_staff_map = {d: c for d, c in department_staff if d}
    
    return {
        "total_students": total_students,
        "total_employees": total_employees,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "net_balance": net_balance,
        "total_outstanding": total_outstanding,
        "defaulter_count": defaulter_count,
        "attendance_present_today": present_today,
        "monthly_revenue": monthly_revenue,
        "monthly_expenses": monthly_expenses,
        "class_enrollment": class_enrollment_map,
        "department_staff": department_staff_map
    }
