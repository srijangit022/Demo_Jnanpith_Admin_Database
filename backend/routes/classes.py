import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.responses import Response

from ..database import get_db
from ..models import Student

router = APIRouter(
    prefix="/classes",
    tags=["classes"],
)

@router.get("/")
def get_classes_summary(db: Session = Depends(get_db)):
    # Group students by grade and count
    summary = db.query(
        Student.grade,
        func.count(Student.id).label("student_count")
    ).group_by(Student.grade).all()
    
    # Format and return the list
    return [{"grade": s.grade or "Unassigned", "student_count": s.student_count} for s in summary]

@router.get("/export/{grade}")
def export_class_excel(grade: str, db: Session = Depends(get_db)):
    # Fetch all students in the grade
    if grade == "Unassigned":
        students = db.query(Student).filter(Student.grade == None).all()
    else:
        students = db.query(Student).filter(Student.grade == grade).all()
        
    if not students:
        raise HTTPException(status_code=404, detail="No students found for this class")
        
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header for CSV (Excel compatible)
    writer.writerow([
        "Student ID", "First Name", "Last Name", "Grade", "Date of Birth", 
        "Enrollment Date", "Contact Number", 
        "Monthly Fees", "Total Fees", "Admission Fees", 
        "Admission Fees Paid", "Admission Fees Due", "Annual Program Fees",
        "Jan Paid", "Feb Paid", "Mar Paid", "Apr Paid", "May Paid", "Jun Paid",
        "Jul Paid", "Aug Paid", "Sep Paid", "Oct Paid", "Nov Paid", "Dec Paid"
    ])
    
    for s in students:
        writer.writerow([
            s.id, s.first_name, s.last_name, s.grade, 
            s.date_of_birth, s.enrollment_date, s.contact_number,
            s.monthly_fees, s.total_fees, s.admission_fees,
            s.admission_fees_paid, s.admission_fees_due, s.annual_program_fees,
            s.fee_paid_jan, s.fee_paid_feb, s.fee_paid_mar, 
            s.fee_paid_apr, s.fee_paid_may, s.fee_paid_jun,
            s.fee_paid_jul, s.fee_paid_aug, s.fee_paid_sep,
            s.fee_paid_oct, s.fee_paid_nov, s.fee_paid_dec
        ])
        
    # Return as CSV file download
    response = Response(content=output.getvalue(), media_type="text/csv")
    safe_grade_name = grade.replace(" ", "_")
    response.headers["Content-Disposition"] = f"attachment; filename=Class_{safe_grade_name}_Details.csv"
    
    return response
