from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from .. import models
from ..database import get_db
from .vendors import Vendor

router = APIRouter(
    prefix="/owner",
    tags=["Owner"]
)

@router.get("/stats")
def get_owner_stats(db: Session = Depends(get_db)):
    # 1. Total Students
    total_students = db.query(func.count(models.Student.id)).scalar() or 0
    
    # 2. Total Employees
    total_employees = db.query(func.count(models.Employee.id)).scalar() or 0
    
    # 3. Total Vendors
    total_vendors = db.query(func.count(Vendor.id)).scalar() or 0
    
    students = db.query(models.Student).all()
    employees = db.query(models.Employee).all()
    vendors = db.query(Vendor).all()
    
    # 4. Total Revenue & 7. Student Dues & 9. Total Defaulters
    total_revenue = 0
    total_student_dues = 0
    total_defaulters = 0
    
    for s in students:
        months_paid = [
            s.fee_paid_jan, s.fee_paid_feb, s.fee_paid_mar, s.fee_paid_apr,
            s.fee_paid_may, s.fee_paid_jun, s.fee_paid_jul, s.fee_paid_aug,
            s.fee_paid_sep, s.fee_paid_oct, s.fee_paid_nov, s.fee_paid_dec
        ]
        
        # Add monthly payments
        total_revenue += sum(amt for amt in months_paid if amt)
        # Add admission paid
        if s.admission_fees_paid:
            total_revenue += s.admission_fees_paid
            
        due = 0
        if s.admission_fees_due and s.admission_fees_due > 0:
            due += s.admission_fees_due
            
        expected_monthly_so_far = (s.monthly_fees or 0) * 12
        paid_monthly = sum(m for m in months_paid if m)
        if expected_monthly_so_far > paid_monthly:
            due += (expected_monthly_so_far - paid_monthly)
            
        total_student_dues += due
        if due > 0:
            total_defaulters += 1

    # 5. Total Expenses & 11. Total Monthly Payroll Liability
    total_expenses = 0
    total_monthly_payroll_liability = 0
    
    for e in employees:
        months_paid = [
            e.salary_paid_jan, e.salary_paid_feb, e.salary_paid_mar, e.salary_paid_apr,
            e.salary_paid_may, e.salary_paid_jun, e.salary_paid_jul, e.salary_paid_aug,
            e.salary_paid_sep, e.salary_paid_oct, e.salary_paid_nov, e.salary_paid_dec
        ]
        total_expenses += sum(amt for amt in months_paid if amt)
        if e.salary:
            total_monthly_payroll_liability += e.salary

    # 8. Total Vendor Dues & Vendor expenses
    total_vendor_dues = 0
    for v in vendors:
        # Assuming payment_given is the total amount paid to vendor overall
        # or we could sum up their monthly payments if they have any
        months_paid = [
            v.payment_jan, v.payment_feb, v.payment_mar, v.payment_apr,
            v.payment_may, v.payment_jun, v.payment_jul, v.payment_aug,
            v.payment_sep, v.payment_oct, v.payment_nov, v.payment_dec
        ]
        total_vendor_payments_monthly = sum(amt for amt in months_paid if amt)
        
        total_expenses += total_vendor_payments_monthly
        if v.payment_given:
            total_expenses += v.payment_given
            
        if v.payment_due and v.payment_due > 0:
            total_vendor_dues += v.payment_due

    # 6. Net Balance
    net_balance = total_revenue - total_expenses
    
    # 10. Today's Student Attendance Rate
    today = date.today()
    present_today = db.query(func.count(models.StudentAttendance.id)).filter(
        models.StudentAttendance.date == today,
        models.StudentAttendance.status == 'Present'
    ).scalar() or 0
    
    attendance_rate = 0
    if total_students > 0:
        attendance_rate = round((present_today / total_students) * 100)

    # 12. Active Classes Count & 13. Class with Highest Enrollment
    class_enrollment = db.query(models.Student.grade, func.count(models.Student.id)).group_by(models.Student.grade).all()
    active_classes_count = len([g for g, c in class_enrollment if g])
    
    highest_enrollment_class = "N/A"
    if class_enrollment:
        highest_enrollment = sorted(class_enrollment, key=lambda x: x[1], reverse=True)[0]
        if highest_enrollment[0]:
            highest_enrollment_class = f"{highest_enrollment[0]} ({highest_enrollment[1]})"
            
    # 14. Upcoming Holidays Count
    next_30_days = today + timedelta(days=30)
    upcoming_holidays_count = db.query(func.count(models.Holiday.id)).filter(
        models.Holiday.start_date >= today,
        models.Holiday.start_date <= next_30_days
    ).scalar() or 0

    return {
        "total_students": total_students,
        "total_employees": total_employees,
        "total_vendors": total_vendors,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "net_balance": net_balance,
        "total_student_dues": total_student_dues,
        "total_vendor_dues": total_vendor_dues,
        "total_defaulters": total_defaulters,
        "attendance_rate": attendance_rate,
        "total_monthly_payroll": total_monthly_payroll_liability,
        "active_classes_count": active_classes_count,
        "highest_enrollment_class": highest_enrollment_class,
        "upcoming_holidays_count": upcoming_holidays_count
    }
