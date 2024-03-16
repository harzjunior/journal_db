import mysql.connector
from random_book_generator import generate_random_book
import time

# Connect to your MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="journal_db"
)
cursor = db.cursor()

# Function to insert a journal into the database
def insert_journal(journal):
    query = "INSERT INTO journals (journal_title, journal_total_page, rating, isbn, published_date, publisher_id) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (journal["title"], journal["total_pages"], journal["rating"], journal["isbn"], journal["published_date"], journal["publisher_id"])

    cursor.execute(query, values)
    db.commit()

# URL of your server
url = "http://localhost:3000/journal"  # Replace with your actual server URL

try:
    while True:
        # Generate a random book
        random_book = generate_random_book()

        # Insert the random book into the local database
        insert_journal(random_book)

        # Make a POST request to add the book to the server
        # response = requests.post(url, json=random_book)

        # Print the response (optional)
        # print(insert_book(random_book)) #post with 2 null fields to the database

        # Wait for 60 seconds before the next iteration
        time.sleep(1)
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Close the database connection in the cleanup section
    cursor.close()
    db.close()
