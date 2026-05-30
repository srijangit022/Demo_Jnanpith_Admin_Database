from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(Date)
    grade = Column(String)
    enrollment_date = Column(Date)
    contact_number = Column(String)
    monthly_fees = Column(Float, default=0.0)
    total_fees = Column(Float, default=0.0)
    admission_fees = Column(Float, default=0.0)
    admission_fees_paid = Column(Float, default=0.0)
    admission_fees_due = Column(Float, default=0.0)
    annual_program_fees = Column(Float, default=0.0)
    fee_paid_jan = Column(Float, default=0.0)
    fee_paid_feb = Column(Float, default=0.0)
    fee_paid_mar = Column(Float, default=0.0)
    fee_paid_apr = Column(Float, default=0.0)
    fee_paid_may = Column(Float, default=0.0)
    fee_paid_jun = Column(Float, default=0.0)
    fee_paid_jul = Column(Float, default=0.0)
    fee_paid_aug = Column(Float, default=0.0)
    fee_paid_sep = Column(Float, default=0.0)
    fee_paid_oct = Column(Float, default=0.0)
    fee_paid_nov = Column(Float, default=0.0)
    fee_paid_dec = Column(Float, default=0.0)
    
    attendance_records = relationship("StudentAttendance", back_populates="student", cascade="all, delete-orphan")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String, unique=True, index=True, nullable=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    department = Column(String)
    position = Column(String)
    joining_date = Column(Date)
    birth_date = Column(Date)
    blood_group = Column(String)
    salary = Column(Float)
    contact_number = Column(String)
    photo_url = Column(String, nullable=True)
    salary_paid_jan = Column(Float, default=0.0)
    salary_paid_feb = Column(Float, default=0.0)
    salary_paid_mar = Column(Float, default=0.0)
    salary_paid_apr = Column(Float, default=0.0)
    salary_paid_may = Column(Float, default=0.0)
    salary_paid_jun = Column(Float, default=0.0)
    salary_paid_jul = Column(Float, default=0.0)
    salary_paid_aug = Column(Float, default=0.0)
    salary_paid_sep = Column(Float, default=0.0)
    salary_paid_oct = Column(Float, default=0.0)
    salary_paid_nov = Column(Float, default=0.0)
    salary_paid_dec = Column(Float, default=0.0)

class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    occasion = Column(String, index=True)
    start_date = Column(Date)
    end_date = Column(Date)
    duration_days = Column(Integer, default=1)

class StudentAttendance(Base):
    __tablename__ = "student_attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    date = Column(Date, index=True)
    status = Column(String)  # 'Present', 'Absent', 'Late'

    student = relationship("Student", back_populates="attendance_records")
