const supertest = require('supertest');
const PgPromise = require("pg-promise");
const express = require('express');
const assert = require('assert');
const fs = require('fs');
const bcrypt = require('bcrypt');
require('dotenv').config()
const API = require('./api');

const { default: axios } = require('axios');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
const config = {
    connectionString: process.env.DATABASE_URL || 'postgres://nkully:nkully@localhost:5432/movies',
    max: 30,
    ssl: { rejectUnauthorized: false }
};


const pgp = PgPromise({});
const db = pgp(config);
// const db = pgp(DATABASE_URL);
API(app, db);
const PORT = process.env.PORT || 4554;
// API routes to be added here
app.get('/', async function(req, res) {
    console.log(req.query)
});
app.listen(PORT, function() {
    console.log(`App started on port ${PORT}`)
});