import pgPromise from 'pg-promise';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import API from './api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from client/dist (production build)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;
const config = {
    connectionString: DATABASE_URL || 'postgres://nkully:nkully@localhost:5432/movies',
};
console.log('🔍 Database URL:', DATABASE_URL ? 'Using Render DB' : 'Using Local DB');

if (process.env.NODE_ENV === "production") {
    config.ssl = {
        rejectUnauthorized: false,
    };
}

const pgp = pgPromise({});
const db = pgp(config);

// Initialize API routes
API(app, db);

// Health check route
app.get('/api/health', async function(req, res) {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 4545;

app.listen(PORT, function() {
    console.log(` Server started on port ${PORT}`);
    console.log(`Database connected: ${DATABASE_URL ? 'Remote' : 'Local'}`);
});