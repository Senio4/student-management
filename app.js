const express = require('express');
const mysql = require('mysql2');

const app = express();

// ========================================
// MYSQL DATABASE CONNECTION
// ========================================

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

// ========================================
// EXPRESS CONFIGURATION
// ========================================

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// ========================================
// DISPLAY AND SEARCH STUDENTS
// ========================================

app.get('/', (req, res) => {

    const search = req.query.search || '';

    let sql = 'SELECT * FROM students';

    let values = [];

    if (search) {

        sql += `
            WHERE student_id LIKE ?
            OR first_name LIKE ?
            OR last_name LIKE ?
            OR course LIKE ?
            OR email LIKE ?
        `;

        const keyword = `%${search}%`;

        values = [
            keyword,
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
            students: results
        });

    });

});


// ========================================
// ADD STUDENT PAGE
// ========================================

app.get('/students/add', (req, res) => {

    res.render('add');

});


// ========================================
// SAVE NEW STUDENT
// ========================================

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


// ========================================
// START SERVER
// ========================================

app.listen(3000, () => {

    console.log('Server running at http://localhost:3000');

});