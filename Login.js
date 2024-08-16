const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password, reason } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (firstName, lastName, email, password, reason) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, hashedPassword, reason], (err, result) => {
        if (err) throw err;
        res.send({ message: 'User registered successfully!' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) throw err;
        if (result.length === 0) return res.status(400).send({ message: 'User not found' });

        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 });
        res.send({ message: 'Login successful', token });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
        password: event.target.password.value,
        reason: event.target.reason.value
    };

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
        email: event.target.emailLogin.value,
        password: event.target.passwordLogin.value
    };

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.token) {
        localStorage.setItem('token', result.token);
        window.location.href = '/aplicatii.html';
    } else {
        alert(result.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Trebuie să fiți autentificat pentru a accesa această secțiune.');
        window.location.href = '/login.html';
    }
});


