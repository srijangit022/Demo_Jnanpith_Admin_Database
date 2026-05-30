# 🎓 Jnanpith Shikshayatan Administrative Management System

A comprehensive School Administration and Financial Management Platform designed for educational institutions to efficiently manage students, employees, vendors, attendance, holidays, analytics, and executive financial reporting.

## 🌐 Live Demo

Demo URL:
https://demo-jnanpith-admin-database.onrender.com/

---

# 📖 Overview

Jnanpith Shikshayatan Administrative Management System is a full-stack web application built using:

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: FastAPI (Python)
- Database: SQLite
- ORM: SQLAlchemy
- Validation: Pydantic
- Charts & Analytics: Chart.js

The platform centralizes school administration operations into a single dashboard, providing real-time monitoring of:

- Student Records
- Employee Management
- Vendor Management
- Attendance Tracking
- Holiday Management
- Financial Analytics
- Executive Owner Dashboard

---

# ✨ Key Features

## 👨‍🎓 Student Management

- Student profile management
- Admission tracking
- Fee collection monitoring
- Monthly payment records
- Student attendance history

## 👨‍🏫 Employee Management

- Employee profile management
- Salary tracking
- Monthly salary payment status
- Staff information and documentation
- Export functionality

## 🏢 Vendor Management

- Vendor database management
- Loan EMI tracking
- Payment history monitoring
- Due amount calculations
- Supplier records

## 📅 Attendance System

- Daily attendance management
- Present / Absent / Late tracking
- Class-wise attendance sheets
- Attendance reporting

## 🎉 Holiday Management

- School holiday scheduling
- Vacation planning
- Upcoming holiday notifications

## 📊 Analytics Dashboard

- Revenue tracking
- Expense monitoring
- Monthly financial trends
- Interactive Chart.js visualizations
- Due amount calculations

## 👑 Owner Dashboard

Executive-level reporting including:

- Total Revenue
- Total Expenses
- Net Liquidity
- Outstanding Dues
- Pending Liabilities
- Institution Financial Health Metrics

---

# 🔐 Security Features

### Level 1: Global Access Authentication

Users must pass a global authentication layer before accessing the application.

### Level 2: Administrative Authorization

Restricted modules require administrative verification:

- Employees
- Vendors
- Analytics
- Owner Dashboard

This provides role-based operational security.

---

# 🏗️ System Architecture

```text
┌─────────────────────┐
│     Frontend SPA    │
│ HTML + CSS + JS     │
└──────────┬──────────┘
           │ Fetch API
           ▼
┌─────────────────────┐
│      FastAPI        │
│ Business Logic      │
│ Authentication      │
│ Data Validation     │
└──────────┬──────────┘
           │ SQLAlchemy
           ▼
┌─────────────────────┐
│      SQLite DB      │
│ Persistent Storage  │
└─────────────────────┘
👨‍💻 Developed By

Srijan Chatterjee

A complete school administration platform focused on operational efficiency, transparency, and financial visibility.


---

# 2. PROJECT_EXPLANATION.md (For Recruiters / Portfolio)

```markdown
# Project Explanation
## Jnanpith Shikshayatan Administrative Management System

### Problem Statement

Educational institutions often manage student records, employee data, fee collection, vendor payments, attendance, and financial reporting across multiple spreadsheets and manual processes.

This creates:

- Data inconsistency
- Reporting delays
- Human errors
- Lack of centralized control

To solve these challenges, I developed a centralized School Administration Management System.

---

## Objective

To build a full-stack administrative platform capable of:

- Managing students
- Managing employees
- Tracking attendance
- Monitoring finances
- Generating analytics
- Providing executive-level reports

within a single application.

---

## My Role

I designed and developed:

- Database architecture
- Backend API development
- Frontend SPA implementation
- Authentication workflow
- Financial analytics engine
- Dashboard visualizations
- Deployment configuration

---

## Technical Design

### Frontend

The frontend is implemented as a Single Page Application (SPA) using:

- HTML5
- CSS3
- JavaScript

The application dynamically updates content without page reloads using asynchronous Fetch API requests.

---

### Backend

The backend is developed using FastAPI.

Responsibilities include:

- API handling
- Data validation
- Business logic
- Authentication
- Database communication

---

### Database

SQLite is used as the database layer.

SQLAlchemy ORM was implemented to:

- Simplify database operations
- Reduce SQL complexity
- Improve maintainability

---

## Major Modules

### Student Management

Stores:

- Personal Information
- Admission Records
- Contact Details
- Monthly Fee Status

---

### Employee Management

Stores:

- Employee Information
- Designation
- Salary Structure
- Salary Payment Status

---

### Vendor Management

Tracks:

- Suppliers
- Payment Histories
- Loan EMIs
- Outstanding Dues

---

### Attendance Management

Allows:

- Daily Attendance
- Class-wise Attendance
- Attendance Reporting

---

### Analytics Dashboard

Generates:

- Revenue Analysis
- Expense Analysis
- Financial Trends
- School Performance Metrics

---

### Owner Dashboard

Executive dashboard that calculates:

- Total Revenue
- Total Expenses
- Cash Flow
- Net Liquidity
- Pending Liabilities

for strategic decision-making.

---

## Security Implementation

The application implements two authentication layers:

### Layer 1

Global application access authentication.

### Layer 2

Administrative authorization for sensitive sections.

This ensures restricted access to critical financial and management information.

---

## Challenges Faced

### Challenge 1

Managing multiple modules without creating a monolithic frontend.

### Solution

Implemented modular JavaScript architecture.

---

### Challenge 2

Generating financial insights from large datasets.

### Solution

Created dedicated analytics APIs using aggregate functions and optimized calculations.

---

### Challenge 3

Maintaining scalability.

### Solution

Separated business logic using FastAPI routers and SQLAlchemy models.

---

## Outcomes

The system successfully centralizes:

- School Administration
- Attendance Monitoring
- Financial Management
- Executive Reporting

into a single platform, improving operational efficiency and data visibility.

---

## Skills Demonstrated

- Python
- FastAPI
- SQLAlchemy
- SQLite
- REST API Development
- JavaScript
- HTML/CSS
- Authentication Systems
- Database Design
- Analytics Dashboards
- Software Architecture
- Full Stack Development
