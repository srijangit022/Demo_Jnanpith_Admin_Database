from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Date, Float
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import csv
import io
from fastapi.responses import Response

# Import Base and get_db from the existing database configuration
from ..database import Base, get_db

# -------------------------
# SQLAlchemy Model
# -------------------------
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    vendor_name = Column(String, index=True)
    vendor_category = Column(String, index=True) # Uniform, Books, Builders, Id card
    loan_emi = Column(Float, default=0.0)
    order_date = Column(Date, nullable=True)
    order_receive_date = Column(Date, nullable=True)
    payment_date = Column(Date, nullable=True)
    payment_given = Column(Float, default=0.0)
    payment_due = Column(Float, default=0.0)
    status = Column(String) # Advance, Due, Paid
    payment_jan = Column(Float, default=0.0)
    payment_feb = Column(Float, default=0.0)
    payment_mar = Column(Float, default=0.0)
    payment_apr = Column(Float, default=0.0)
    payment_may = Column(Float, default=0.0)
    payment_jun = Column(Float, default=0.0)
    payment_jul = Column(Float, default=0.0)
    payment_aug = Column(Float, default=0.0)
    payment_sep = Column(Float, default=0.0)
    payment_oct = Column(Float, default=0.0)
    payment_nov = Column(Float, default=0.0)
    payment_dec = Column(Float, default=0.0)

# -------------------------
# Pydantic Schemas
# -------------------------
class VendorBase(BaseModel):
    vendor_name: Optional[str] = None
    vendor_category: Optional[str] = None
    loan_emi: float = 0.0
    order_date: Optional[date] = None
    order_receive_date: Optional[date] = None
    payment_date: Optional[date] = None
    payment_given: float = 0.0
    payment_due: float = 0.0
    status: Optional[str] = None
    payment_jan: float = 0.0
    payment_feb: float = 0.0
    payment_mar: float = 0.0
    payment_apr: float = 0.0
    payment_may: float = 0.0
    payment_jun: float = 0.0
    payment_jul: float = 0.0
    payment_aug: float = 0.0
    payment_sep: float = 0.0
    payment_oct: float = 0.0
    payment_nov: float = 0.0
    payment_dec: float = 0.0

class VendorCreate(VendorBase):
    pass

class VendorUpdate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int

    class Config:
        from_attributes = True

# -------------------------
# API Router
# -------------------------
router = APIRouter(
    prefix="/vendors",
    tags=["vendors"],
)

@router.get("/", response_model=List[VendorResponse])
def read_vendors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vendors = db.query(Vendor).offset(skip).limit(limit).all()
    return vendors

@router.get("/export")
def export_vendor_excel(db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    if not vendors:
        raise HTTPException(status_code=404, detail="No vendors found")
        
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        "Vendor ID", "Firm Name", "Category", "Loan EMI", 
        "Order Date", "Receive Date", "Payment Date", 
        "Given Amount", "Due Amount", "Status",
        "Jan Paid", "Feb Paid", "Mar Paid", "Apr Paid", "May Paid", "Jun Paid",
        "Jul Paid", "Aug Paid", "Sep Paid", "Oct Paid", "Nov Paid", "Dec Paid"
    ])
    
    for v in vendors:
        writer.writerow([
            v.id, v.vendor_name, v.vendor_category, v.loan_emi,
            v.order_date, v.order_receive_date, v.payment_date,
            v.payment_given, v.payment_due, v.status,
            v.payment_jan, v.payment_feb, v.payment_mar,
            v.payment_apr, v.payment_may, v.payment_jun,
            v.payment_jul, v.payment_aug, v.payment_sep,
            v.payment_oct, v.payment_nov, v.payment_dec
        ])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=Vendors_Export.csv"
    return response

@router.post("/", response_model=VendorResponse)
def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = Vendor(**vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.put("/{vendor_id}", response_model=VendorResponse)
def update_vendor(vendor_id: int, vendor: VendorUpdate, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    for key, value in vendor.dict().items():
        setattr(db_vendor, key, value)
        
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(db_vendor)
    db.commit()
    return {"message": "Vendor deleted successfully"}
