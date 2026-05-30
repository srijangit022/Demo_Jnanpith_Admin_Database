import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'school.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE employees ADD COLUMN photo_url VARCHAR")
    print("Added column photo_url to employees")
except sqlite3.OperationalError as e:
    print(f"Column might already exist: {e}")

conn.commit()
conn.close()
print("Migration completed successfully.")
