const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_management',
    port: Number(process.env.DB_PORT) || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }

    console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// GET student list
app.get('/', (req, res) => {
    db.query('SELECT * FROM students ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        res.render('index', {
            students: results || []
        });
    });
});

// ADD STUDENT PAGE
app.get('/students/add', (req, res) => {
    res.render('add');
});

// SAVE NEW STUDENT
app.post('/students/add', (req, res) => {
    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_id, first_name, last_name, course, year_level, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    ];

    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to save student');
        }

        res.redirect('/');
    });
});

// EDIT STUDENT PAGE
app.get('/students/edit/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (!results || results.length === 0) {
            return res.status(404).send('Student not found');
        }

        res.render('edit', { student: results[0] });
    });
});

// UPDATE STUDENT
app.post('/students/update/:id', (req, res) => {
    const { id } = req.params;
    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        UPDATE students
        SET student_id = ?, first_name = ?, last_name = ?, course = ?, year_level = ?, email = ?
        WHERE id = ?
    `;

    db.query(sql, [student_id, first_name, last_name, course, year_level, email, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to update student');
        }

        res.redirect('/');
    });
});

// DELETE STUDENT
app.post('/students/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to delete student');
        }

        res.redirect('/');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
