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
