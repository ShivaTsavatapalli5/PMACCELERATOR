const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '9949051488',
    database: 'weather_app_db'
};

// CREATE
app.post('/records', async (req, res) => {
    const { location, start_date, end_date, weather_data } = req.body;
    if (!location || !start_date || !end_date || !weather_data) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute(
            'INSERT INTO weather_records (location, start_date, end_date, weather_data) VALUES (?, ?, ?, ?)',
            [location, start_date, end_date, JSON.stringify(weather_data)]
        );
        conn.end();
        res.json({ message: 'Record created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ
app.get('/records', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT * FROM weather_records');
        conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
app.put('/records/:id', async (req, res) => {
    const { id } = req.params;
    const { location, start_date, end_date, weather_data } = req.body;
    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute(
            'UPDATE weather_records SET location=?, start_date=?, end_date=?, weather_data=? WHERE id=?',
            [location, start_date, end_date, JSON.stringify(weather_data), id]
        );
        conn.end();
        res.json({ message: 'Record updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
app.delete('/records/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute('DELETE FROM weather_records WHERE id=?', [id]);
        conn.end();
        res.json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
