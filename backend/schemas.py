from pydantic import BaseModel
from datetime import date
from typing import Optional

# Student Schemas
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    grade: str
    enrollment_date: date
    contact_number: str
    monthly_fees: float = 0.0
    total_fees: float = 0.0
    admission_fees: float = 0.0
    admission_fees_paid: float = 0.0
    admission_fees_due: float = 0.0
    annual_program_fees: float = 0.0
    fee_paid_jan: float = 0.0
    fee_paid_feb: float = 0.0
    fee_paid_mar: float = 0.0
    fee_paid_apr: float = 0.0
    fee_paid_may: float = 0.0
    fee_paid_jun: float = 0.0
    fee_paid_jul: float = 0.0
    fee_paid_aug: float = 0.0
    fee_paid_sep: float = 0.0
    fee_paid_oct: float = 0.0
    fee_paid_nov: float = 0.0
    fee_paid_dec: float = 0.0

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    grade: Optional[str] = None
    enrollment_date: Optional[date] = None
    contact_number: Optional[str] = None
    monthly_fees: Optional[float] = None
    total_fees: Optional[float] = None
    admission_fees: Optional[float] = None
    admission_fees_paid: Optional[float] = None
    admission_fees_due: Optional[float] = None
    annual_program_fees: Optional[float] = None
    fee_paid_jan: Optional[float] = None
    fee_paid_feb: Optional[float] = None
    fee_paid_mar: Optional[float] = None
    fee_paid_apr: Optional[float] = None
    fee_paid_may: Optional[float] = None
    fee_paid_jun: Optional[float] = None
    fee_paid_jul: Optional[float] = None
    fee_paid_aug: Optional[float] = None
    fee_paid_sep: Optional[float] = None
    fee_paid_oct: Optional[float] = None
    fee_paid_nov: Optional[float] = None
    fee_paid_dec: Optional[float] = None

class Student(StudentBase):
    id: int

    class Config:
        orm_mode = True


# Employee Schemas
class EmployeeBase(BaseModel):
    emp_id: Optional[str] = None
    first_name: str
    last_name: str
    department: str
    position: str
    joining_date: date
    birth_date: date
    blood_group: str
    salary: float
    contact_number: str
    photo_url: Optional[str] = None
    salary_paid_jan: float = 0.0
    salary_paid_feb: float = 0.0
    salary_paid_mar: float = 0.0
    salary_paid_apr: float = 0.0
    salary_paid_may: float = 0.0
    salary_paid_jun: float = 0.0
    salary_paid_jul: float = 0.0
    salary_paid_aug: float = 0.0
    salary_paid_sep: float = 0.0
    salary_paid_oct: float = 0.0
    salary_paid_nov: float = 0.0
    salary_paid_dec: float = 0.0

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    emp_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    joining_date: Optional[date] = None
    birth_date: Optional[date] = None
    blood_group: Optional[str] = None
    salary: Optional[float] = None
    contact_number: Optional[str] = None
    photo_url: Optional[str] = None
    salary_paid_jan: Optional[float] = None
    salary_paid_feb: Optional[float] = None
    salary_paid_mar: Optional[float] = None
    salary_paid_apr: Optional[float] = None
    salary_paid_may: Optional[float] = None
    salary_paid_jun: Optional[float] = None
    salary_paid_jul: Optional[float] = None
    salary_paid_aug: Optional[float] = None
    salary_paid_sep: Optional[float] = None
    salary_paid_oct: Optional[float] = None
    salary_paid_nov: Optional[float] = None
    salary_paid_dec: Optional[float] = None

class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True

# Holiday Schemas
class HolidayBase(BaseModel):
    occasion: str
    start_date: date
    end_date: date
    duration_days: int = 1

class HolidayCreate(HolidayBase):
    pass

class HolidayUpdate(BaseModel):
    occasion: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: Optional[int] = None

class Holiday(HolidayBase):
    id: int

    class Config:
        orm_mode = True

# Attendance Schemas
class AttendanceRecord(BaseModel):
    student_id: int
    status: str

class ClassAttendanceSubmit(BaseModel):
    date: date
    grade: str
    records: list[AttendanceRecord]

class StudentAttendanceResponse(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    status: Optional[str] = None
