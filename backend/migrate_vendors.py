import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'school.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
for month in months:
    try:
        cursor.execute(f"ALTER TABLE vendors ADD COLUMN payment_{month} FLOAT DEFAULT 0.0")
        print(f"Added payment_{month}")
    except sqlite3.OperationalError as e:
        print(f"Skipped payment_{month}: {e}")

conn.commit()
conn.close()
print("Migration completed.")
