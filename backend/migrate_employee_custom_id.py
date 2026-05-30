import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'school.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE employees ADD COLUMN emp_id VARCHAR(50)")
    print("Added emp_id successfully.")
except sqlite3.OperationalError as e:
    print(f"Skipped emp_id: {e}")

conn.commit()
conn.close()
