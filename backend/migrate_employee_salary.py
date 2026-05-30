import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'school.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

for m in months:
    col = f'salary_paid_{m}'
    try:
        cursor.execute(f"ALTER TABLE employees ADD COLUMN {col} FLOAT DEFAULT 0.0")
        print(f"Added {col}")
    except sqlite3.OperationalError as e:
        print(f"Skipped {col}: {e}")

conn.commit()
conn.close()
print("Salary migration completed successfully.")
