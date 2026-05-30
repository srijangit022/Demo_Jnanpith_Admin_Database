import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'school.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

for month in months:
    col_name = f'fee_paid_{month}'
    try:
        cursor.execute(f"ALTER TABLE students ADD COLUMN {col_name} FLOAT DEFAULT 0.0")
        print(f"Added column {col_name}")
    except sqlite3.OperationalError as e:
        print(f"Column {col_name} might already exist: {e}")

conn.commit()
conn.close()
print("Migration completed successfully.")
