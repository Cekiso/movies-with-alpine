import pgPromise from 'pg-promise';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import API from './api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Test database connection
db.one('SELECT NOW() as time')
    .then((result) => {
        console.log('✅ Database connected at:', result.time);
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
    });

// Initialize API routes FIRST
API(app, db);

// Health check route
app.get('/api/health', async function(req, res) {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static files - Check if dist folder exists
const staticPath = path.join(__dirname, '../client/dist');
console.log('📁 Static path:', staticPath);
console.log('📁 Static path exists:', fs.existsSync(staticPath));

if (fs.existsSync(staticPath)) {
    const files = fs.readdirSync(staticPath);
    console.log('📁 Files in dist:', files);
    app.use(express.static(staticPath));
} else {
    console.error('❌ WARNING: dist folder not found at', staticPath);
}

// Serve index.html for all other routes (SPA support)
// This must be LAST
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    console.log('📄 Serving index.html for:', req.url);
    console.log('📄 Index path:', indexPath);
    console.log('📄 Index exists:', fs.existsSync(indexPath));
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('App not built. Run: cd client && npm run build');
    }
});

const PORT = process.env.PORT || 4545;

app.listen(PORT, function() {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📊 Database connected: ${DATABASE_URL ? 'Remote' : 'Local'}`);
});