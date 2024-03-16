import random
from datetime import datetime, timedelta

def generate_random_book():
    titles = [
        "The Great Gatsby", "To Kill a Mockingbird", "1984", "Pride and Prejudice", "The Catcher in the Rye",
        "The Hobbit", "The Shining", "The Hunger Games", "The Da Vinci Code", "The Lord of the Rings",
        "Harry Potter and the Sorcerer's Stone", "The Chronicles of Narnia", "Moby-Dick", "Frankenstein",
        "Brave New World", "One Hundred Years of Solitude", "The Odyssey", "The Iliad", "War and Peace",
        "Crime and Punishment", "The Brothers Karamazov", "The Count of Monte Cristo", "Les Misérables",
        "Anna Karenina", "Gone with the Wind", "The Grapes of Wrath", "The Scarlet Letter", "Wuthering Heights",
        "Jane Eyre", "Emma", "Sense and Sensibility", "North and South", "Great Expectations", "Oliver Twist",
        "David Copperfield", "A Tale of Two Cities", "The Picture of Dorian Gray", "Dracula", "Alice's Adventures in Wonderland",
        "The Adventures of Sherlock Holmes", "Heart of Darkness", "Lord of the Flies", "The Old Man and the Sea",
        "The Sun Also Rises", "For Whom the Bell Tolls", "The Sound and the Fury", "As I Lay Dying", "The Grapes of Wrath",
        "Siddhartha", "The Stranger", "The Plague", "One Flew Over the Cuckoo's Nest", "The Great Gatsby",
        "To Kill a Mockingbird", "1984", "Pride and Prejudice", "The Catcher in the Rye", "The Hobbit", "The Shining",
        "The Hunger Games", "The Da Vinci Code", "The Lord of the Rings", "Harry Potter and the Sorcerer's Stone",
        "The Chronicles of Narnia", "Moby-Dick", "Frankenstein", "Brave New World", "One Hundred Years of Solitude",
        "The Odyssey", "The Iliad", "War and Peace", "Crime and Punishment", "The Brothers Karamazov",
        "The Count of Monte Cristo", "Les Misérables", "Anna Karenina", "Gone with the Wind", "The Grapes of Wrath",
        "The Scarlet Letter", "Wuthering Heights", "Jane Eyre", "Emma", "Sense and Sensibility", "North and South",
        "Great Expectations", "Oliver Twist", "David Copperfield", "A Tale of Two Cities", "The Picture of Dorian Gray",
        "Dracula", "Alice's Adventures in Wonderland", "The Adventures of Sherlock Holmes", "Heart of Darkness",
        "Lord of the Flies", "The Old Man and the Sea", "The Sun Also Rises", "For Whom the Bell Tolls",
        "The Sound and the Fury", "As I Lay Dying", "The Grapes of Wrath", "Siddhartha", "The Stranger", "The Plague",
        "One Flew Over the Cuckoo's Nest"
    ]

    authors = [
        "F. Scott Fitzgerald", "Harper Lee", "George Orwell", "Jane Austen", "J.D. Salinger",
        "J.R.R. Tolkien", "Stephen King", "Suzanne Collins", "Dan Brown", "J.K. Rowling",
        "C.S. Lewis", "Herman Melville", "Mary Shelley", "Aldous Huxley", "Gabriel García Márquez",
        "Homer", "Homer", "Leo Tolstoy", "Fyodor Dostoevsky", "Fyodor Dostoevsky",
        "Alexandre Dumas", "Victor Hugo", "Leo Tolstoy", "Charlotte Brontë", "Emily Brontë",
        "Charlotte Brontë", "Jane Austen", "Jane Austen", "Elizabeth Gaskell", "Charles Dickens",
        "Charles Dickens", "Charles Dickens", "Charles Dickens", "Oscar Wilde", "Bram Stoker",
        "Lewis Carroll", "Arthur Conan Doyle", "Joseph Conrad", "William Golding", "Ernest Hemingway",
        "Ernest Hemingway", "William Faulkner", "William Faulkner", "John Steinbeck",
        "Hermann Hesse", "Albert Camus", "Albert Camus", "Ken Kesey", "F. Scott Fitzgerald",
        "Harper Lee", "George Orwell", "Jane Austen", "J.D. Salinger", "J.R.R. Tolkien", "Stephen King",
        "Suzanne Collins", "Dan Brown", "J.K. Rowling", "C.S. Lewis", "Herman Melville",
        "Mary Shelley", "Aldous Huxley", "Gabriel García Márquez", "Homer", "Homer", "Leo Tolstoy",
        "Fyodor Dostoevsky", "Fyodor Dostoevsky", "Alexandre Dumas", "Victor Hugo", "Leo Tolstoy",
        "Charlotte Brontë", "Emily Brontë", "Charlotte Brontë", "Jane Austen", "Jane Austen",
        "Elizabeth Gaskell", "Charles Dickens", "Charles Dickens", "Charles Dickens", "Charles Dickens",
        "Oscar Wilde", "Bram Stoker", "Lewis Carroll", "Arthur Conan Doyle", "Joseph Conrad",
        "William Golding", "Ernest Hemingway", "Ernest Hemingway", "William Faulkner", "William Faulkner",
        "John Steinbeck", "Hermann Hesse", "Albert Camus", "Albert Camus", "Ken Kesey"
    ]

    publishers = ["Publisher A", "Publisher B", "Publisher C"]

    total_pages = random.randint(100, 500)
    rating = round(random.uniform(3.0, 5.0), 2)
    isbn = ''.join(str(random.randint(0, 9)) for _ in range(12))  # Fixed length to 12 digits
    published_date = datetime.now() - timedelta(days=random.randint(1, 365))
    publisher_id = random.randint(1, 3)

    return {
        "title": random.choice(titles),
        "total_pages": total_pages,
        "rating": rating,
        "isbn": isbn,
        "published_date": published_date.strftime("%Y-%m-%d"),
        "publisher_id": publisher_id
    }
