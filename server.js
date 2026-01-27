onlinecardappwebservice
server.js


// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const port = 3000;

// database config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// initialize app
const app = express();
app.use(express.json());

// CORS config
const allowedOrigins = [
    "http://localhost:3000",
    "https://onlinecardapp.onrender.com"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
    })
);

// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// ================= ROUTES =================

// GET all cards
app.get('/allcards', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allcards' });
    } finally {
        if (connection) await connection.end();
    }
});

// ADD a card
app.post('/addcard', async (req, res) => {
    const { card_name, card_pic } = req.body;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO cards (card_name, card_pic) VALUES (?, ?)',
            [card_name, card_pic]
        );
        res.status(201).json({ message: `Card ${card_name} added successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add card' });
    } finally {
        if (connection) await connection.end();
    }
});

// UPDATE a card
app.put('/updatecard/:id', async (req, res) => {
    const { id } = req.params;
    const { card_name, card_pic } = req.body;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE cards SET card_name=?, card_pic=? WHERE id=?',
            [card_name, card_pic, id]
        );
        res.json({ message: `Card ${id} updated successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update card' });
    } finally {
        if (connection) await connection.end();
    }
});

// DELETE a card
app.delete('/deletecard/:id', async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM cards WHERE id=?',
            [id]
        );
        res.json({ message: `Card ${id} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete card' });
    } finally {
        if (connection) await connection.end();
    }
});
