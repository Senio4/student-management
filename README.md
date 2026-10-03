# Student Management System

A simple web-based Student Management System developed using:
- Node.js
- Express.js
- EJS
- MySQL
- Git
- GitHub

## Features
- View students
- Add students
- Edit students
- Delete students
- Search students
- Form validation

## Installation

Clone the repository:
```bash
git clone https://github.com/Senio4/student-management.git
```

Install dependencies:
```bash
npm install
```

Create a MySQL database and table:
```sql
CREATE DATABASE student_management;
USE student_management;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year_level INT NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create a `.env` file based on `.env.example` and update the database settings if needed.

Run the app:
```bash
npm start
```

Open:
```text
http://localhost:3000
```

## AI Usage
This project demonstrates responsible AI-assisted development:
- explaining code
- reviewing logic
- suggesting improvements
- testing generated solutions
- validating security practices

## Notes
- Never commit `.env` files to GitHub.
- Use parameterized SQL queries to prevent SQL injection.
- Keep the database credentials outside the source code.
