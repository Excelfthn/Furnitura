import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToSnowflake, executeQuery } from './snowflake.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get all furniture items
app.get('/api/furniture', async (req, res) => {
    try {
        const rows = await executeQuery('SELECT * FROM FURNITURE_CATALOG ORDER BY CATEGORY, NAME');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get furniture by category
app.get('/api/furniture/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const rows = await executeQuery(
            'SELECT * FROM FURNITURE_CATALOG WHERE CATEGORY = ? ORDER BY NAME',
            [category.toUpperCase()]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search furniture
app.get('/api/furniture/search', async (req, res) => {
    try {
        const { q } = req.query;
        const rows = await executeQuery(
            `SELECT * FROM FURNITURE_CATALOG 
       WHERE NAME LIKE ? OR DESCRIPTION LIKE ? 
       ORDER BY NAME`,
            [`%${q}%`, `%${q}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize server
const startServer = async () => {
    try {
        await connectToSnowflake();
        app.listen(PORT, () => {
            console.log(`🚀 Backend server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
