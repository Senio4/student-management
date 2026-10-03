require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function validateStudentInput(data) {
  const { student_id, first_name, last_name, course, year_level, email } = data;

  if (!student_id || !first_name || !last_name || !course || !year_level || !email) {
    return 'All fields are required.';
  }

  if (!/^[1-5]$/.test(String(year_level))) {
    return 'Year level must be a number from 1 to 5.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

app.get('/', (req, res) => {
  const keyword = (req.query.keyword || '').toString().trim();

  const sql = keyword
    ? `
      SELECT *
      FROM students
      WHERE student_id LIKE ?
        OR first_name LIKE ?
        OR last_name LIKE ?
        OR course LIKE ?
        OR email LIKE ?
      ORDER BY id DESC
    `
    : 'SELECT * FROM students ORDER BY id DESC';

  const values = keyword
    ? [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    : [];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    res.render('index', {
      students: results,
      keyword,
    });
  });
});

app.get('/students/add', (req, res) => {
  res.render('add');
});

app.post('/students/add', (req, res) => {
  const validationError = validateStudentInput(req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const { student_id, first_name, last_name, course, year_level, email } = req.body;

  const sql = `
    INSERT INTO students (student_id, first_name, last_name, course, year_level, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [student_id, first_name, last_name, course, year_level, email];

  db.query(sql, values, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Student ID already exists. Please use a unique student ID.');
      }

      console.error(err);
      return res.status(500).send('Unable to save student');
    }

    res.redirect('/');
  });
});

app.get('/students/edit/:id', (req, res) => {
  const studentId = req.params.id;

  db.query('SELECT * FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(404).send('Student not found');
    }

    res.render('edit', { student: results[0] });
  });
});

app.post('/students/update/:id', (req, res) => {
  const studentId = req.params.id;
  const validationError = validateStudentInput(req.body);

  if (validationError) {
    return res.status(400).send(validationError);
  }

  const { student_id, first_name, last_name, course, year_level, email } = req.body;

  const sql = `
    UPDATE students
    SET student_id = ?, first_name = ?, last_name = ?, course = ?, year_level = ?, email = ?
    WHERE id = ?
  `;

  const values = [student_id, first_name, last_name, course, year_level, email, studentId];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Student ID already exists. Please use a unique student ID.');
      }

      console.error(err);
      return res.status(500).send('Unable to update student');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }

    res.redirect('/');
  });
});

app.post('/students/delete/:id', (req, res) => {
  const studentId = req.params.id;

  db.query('DELETE FROM students WHERE id = ?', [studentId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to delete student');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }

    res.redirect('/');
  });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
