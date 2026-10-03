# Student Management System

A simple yet powerful student management application built with Node.js, Express, MySQL, and EJS templating.

## Features

- **View Students**: Display all students in a paginated table
- **Add Student**: Add new students with complete information
- **Edit Student**: Update existing student information
- **Delete Student**: Remove students from the database
- **Responsive Design**: Clean and user-friendly interface

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Senio4/student-management.git
   cd student-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create the database**
   ```sql
   CREATE DATABASE student_management;
   USE student_management;

   CREATE TABLE students (
     id INT AUTO_INCREMENT PRIMARY KEY,
     student_id VARCHAR(50) NOT NULL UNIQUE,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     course VARCHAR(100) NOT NULL,
     year_level INT NOT NULL,
     email VARCHAR(100) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Configure database connection**
   
   Update the database credentials in `app.js`:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'your_password',
       database: 'student_management'
   });
   ```

## Running the Application

Start the application:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The application will be available at:
```
http://localhost:3000
```

## Project Structure

```
student-management/
├── app.js                 # Main application file
├── package.json           # Project dependencies
├── package-lock.json      # Locked dependency versions
├── README.md             # This file
├── .gitignore            # Git ignore rules
├── views/                # EJS templates
│   ├── index.ejs         # Student list view
│   ├── add.ejs           # Add student form
│   └── edit.ejs          # Edit student form
└── public/               # Static files (CSS, JS, images)
```

## API Routes

### GET Routes

- `GET /` - Display all students
- `GET /students/add` - Show add student form
- `GET /students/edit/:id` - Show edit student form

### POST Routes

- `POST /students/add` - Save new student
- `POST /students/update/:id` - Update student information
- `POST /students/delete/:id` - Delete a student

## Database Schema

### students table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| student_id | VARCHAR(50) | Unique student identifier |
| first_name | VARCHAR(100) | Student's first name |
| last_name | VARCHAR(100) | Student's last name |
| course | VARCHAR(100) | Course/Program name |
| year_level | INT | Academic year (1-5) |
| email | VARCHAR(100) | Student's email address |
| created_at | TIMESTAMP | Record creation timestamp |

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Templating**: EJS
- **Package Manager**: npm

## Dependencies

```json
{
  "ejs": "^6.0.1",
  "express": "^5.2.1",
  "mysql2": "^3.24.5"
}
```

## Features in Detail

### View Students
- Displays all students in a sorted table
- Shows student information including ID, name, course, year level, and email
- Edit and delete buttons for each student

### Add Student
- Form to input new student information
- Validates required fields
- Prevents duplicate student IDs

### Edit Student
- Pre-populated form with existing student data
- Update any student information
- Confirmation on save

### Delete Student
- Remove students with confirmation
- Soft delete or hard delete based on implementation

## Future Enhancements

- [ ] Search and filter functionality
- [ ] Pagination for large student lists
- [ ] Student performance tracking
- [ ] Grade management
- [ ] Attendance tracking
- [ ] User authentication and authorization
- [ ] Data export to PDF/Excel
- [ ] Email notifications

## Error Handling

The application includes error handling for:
- Database connection failures
- Query errors
- Invalid student IDs
- Missing form data
- Server errors

## Security Notes

- Always use environment variables for sensitive data (passwords, database credentials)
- Implement input validation on both client and server side
- Use prepared statements (parameterized queries) to prevent SQL injection
- Implement user authentication for production use

## Environment Variables (Optional)

Create a `.env` file for better configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=3000
```

## Troubleshooting

### Database Connection Failed
- Ensure MySQL is running
- Verify database credentials in app.js
- Check if the database exists

### Port Already in Use
- Change the port in app.js
- Or kill the process using port 3000

### Missing Dependencies
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## License

This project is licensed under the ISC License - see the package.json file for details.

## Author

**Senio4**

## Support

For issues or questions, please create an issue in the repository or contact the author.

---

**Happy coding!** 🚀
