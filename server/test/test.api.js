const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

// const test = require('test');

const API = require('../api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://nkully:nkully@localhost:5432/movies';
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);

API(app, db);

describe('The Movie Api', function() {

    before(async function() {
        this.timeout(5000);
        // await db.none(`delete from user_movies`);
        // await db.none(`delete from users`);


        // const commandText = fs.readFileSync('./sql/movie_user.sql', 'utf-8');
        // await db.none(commandText)
    });

    it('should have a test method', async() => {

        const response = await supertest(app)
            .get('/api/test')
            .expect(200);

        assert.deepStrictEqual({ name: 'joe' }, response.body);

    });
    it('should be able to add a new user', async() => {

        const response = await supertest(app)
            .post('/api/register')
            .send({
                username: 'mogerl',
                lastname: 'Cekiso',
                firstname: 'Nkuli',
                password: 12345

            });

        assert.equal("success", response.body.data);

    });
    it('should be able to login a user', async() => {

        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'nkule',
                password: 458

            });

        assert.equal(true, response.body.success);

    });
    it('should be able to add a movie to the users playlist', async() => {


        const response = await supertest(app)
            .post('/api/playlist')
            .send({
                movie_id: 9494,
                movie_title: "Look Who's Talking",
                img: "/k60x5YEOox9P9vWITSHFSkLGecN.jpg",
                user_id: 4
            });

        assert.equal("success", response.body.status);

    });
    it('should be able to display with the user id', async() => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'nkule',
                password: 458

            });
        const id = response.body.userid
        const responseID = await supertest(app)
            .get('/api/playlist/' + id)
            .expect(200);


        assert.equal(1, responseID.body.result);

    });

    after(() => {
        db.$pool.end();
    });
})