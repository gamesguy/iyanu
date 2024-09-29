const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const pg = require('pg');

require('dotenv').config();

const port = 3000;

// Set up PostgreSQL connection pool
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false, // SSL disabled for simplicity
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false, maxAge: 60000 * 15 } // Session lasts for 15 minutes
}));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'triple i prototype website')));

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is authenticated, proceed
    } else {
        res.redirect('/start'); // User is not authenticated, redirect to start page
    }
};

// Routes
app.get('/', (req, res) => {
    console.log('Checking session for root route:', req.session.user);
    if (req.session.user) {
        console.log('User is logged in, redirecting to /welcome');
        res.redirect('/welcome');
    } else {
        console.log('User is not logged in, redirecting to /start');
        res.redirect('/start');
    }
});

app.get('/welcome', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'triple i prototype website', 'welcome.html'));
});

app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'triple i prototype website', 'index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/welcome');
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    }
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/welcome');
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
    }
});

app.get('/get-user-info', ensureAuthenticated, (req, res) => {
    console.log('Session user info:', req.session.user);
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.json({ username: null });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }
        res.redirect('/start');
    });
});

// Registration handler
app.post('/register-user', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(`Registering user: ${JSON.stringify({ username, email, password })}`);

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Existing user check:', existingUser.rows);

        if (existingUser.rows.length > 0) {
            console.log('Email already taken');
            return res.json({ success: false, message: 'Email already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Save user to the database
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

        // Save the user information to the session
        req.session.user = { username, email };

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

// Login handler
app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Logging in user: ${JSON.stringify({ email, password })}`);

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('User check:', user.rows);

        if (user.rows.length === 0) {
            console.log('Login failed. User not found.');
            return res.json({ success: false, message: 'Login failed. Please check your credentials.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            console.log('Login failed. Incorrect password.');
            return res.json({ success: false, message: 'Login failed. Please check your credentials.' });
        }

        // Save the user information to the session
        req.session.user = { username: user.rows[0].username, email };

        // Redirect to the welcome page upon successful login
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
