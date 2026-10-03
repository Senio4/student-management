const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_management'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }

    console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// =========================
// STUDENT LIST + SEARCH
// =========================

app.get('/', (req, res) => {
    const search = req.query.search || '';

    let sql = `
        SELECT * FROM students
    `;

    let values = [];

    if (search) {
        sql += `
            WHERE student_id LIKE ?
            OR first_name LIKE ?
            OR last_name LIKE ?
            OR course LIKE ?
        `;

        const keyword = `%${search}%`;

        values = [
            keyword,
            keyword,
            keyword,
            keyword
        ];
    }

    sql += ' ORDER BY id DESC';

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        res.render('index', {
            students: results,
            search: search
        });
    });
});

// =========================
// ADD STUDENT
// =========================

app.get('/add', (req, res) => {
    res.render('add', {
        error: null
    });
});

app.post('/add', (req, res) => {
    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    if (
        !student_id ||
        !first_name ||
        !last_name ||
        !course ||
        !year_level ||
        !email
    ) {
        return res.render('add', {
            error: 'All fields are required.'
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.render('add', {
            error: 'Please enter a valid email address.'
        });
    }

    const year = Number(year_level);

    if (year < 1 || year > 4) {
        return res.render('add', {
            error: 'Year level must be between 1 and 4.'
        });
    }

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
        year,
        email
    ];

    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('add', {
                    error: 'Student ID already exists.'
                });
            }

            return res.status(500).send('Database error');
        }

        res.redirect('/');
    });
});

// =========================
// EDIT STUDENT
// =========================

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM students WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).send('Student not found');
        }

        res.render('edit', {
            student: results[0],
            error: null
        });
    });
});

app.post('/edit/:id', (req, res) => {
    const id = req.params.id;

    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    if (
        !student_id ||
        !first_name ||
        !last_name ||
        !course ||
        !year_level ||
        !email
    ) {
        return res.status(400).send('All fields are required.');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).send('Please enter a valid email address.');
    }

    const year = Number(year_level);

    if (year < 1 || year > 4) {
        return res.status(400).send('Year level must be between 1 and 4.');
    }

    const sql = `
        UPDATE students
        SET student_id = ?,
            first_name = ?,
            last_name = ?,
            course = ?,
            year_level = ?,
            email = ?
        WHERE id = ?
    `;

    const values = [
        student_id,
        first_name,
        last_name,
        course,
        year,
        email,
        id
    ];

    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Student ID already exists.');
            }

            return res.status(500).send('Database error');
        }

        res.redirect('/');
    });
});

// =========================
// DELETE STUDENT
// =========================

app.post('/delete/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        res.redirect('/');
    });
});

// =========================
// START SERVER
// =========================

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});