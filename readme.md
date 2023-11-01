# Movie Listing Application

## Introduction

### Tech used

```
   Next.js
   React.js
   Node.js
   Postgresql
   Tailwindcss
```

This is a simple movie listing application that allows users to register, manage a list of their favorite movies. Users can add, edit, and delete movies from their list.

## Setup Instructions

1. Clone the repository.
2. Install the necessary dependencies using `npm install`.
3. Set up the PostgreSQL database or use the following configuration:

   ```javascript
   const pool = new Pool({
     user: "gvuxuaqw",
     host: "cornelius.db.elephantsql.com",
     database: "gvuxuaqw",
     password: "2xjLQqBa0enpn_cEFC_aZ9eAaygL5XqN",
     port: 5432,
   });
   ```

4. Run the Node.js application using `npm start`.

## Database Setup (optional)

Ensure that you have PostgreSQL installed and create the following tables in your database:

```sql
-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    movie_name VARCHAR(100) NOT NULL,
    rating FLOAT NOT NULL,
    movie_cast TEXT[],
    genre VARCHAR(50),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
