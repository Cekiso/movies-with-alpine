const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

// const test = require('test');

const API = require('../server/api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const config = {
    connectionString: process.env.DATABASE_URL || 'postgres://nkully:nkully@localhost:5432/movies',
    max: 30,
    ssl: { rejectUnauthorized: false }
};
const pgp = PgPromise({});
const db = pgp(config);
API(app, db);

describe('The Movie Api', function() {

    before(async function() {
        this.timeout(5000);
        await db.none(`delete from user_movies`);
        await db.none(`delete from users`);


        // const commandText = fs.readFileSync('./sql/movie_user.sql', 'utf-8');
        // await db.none(commandText)
    });

    it('should be able to register a new user', async () => {

        const response = await supertest(app).post('/api/register').send({
            username: 'mogerl',
            lastname: 'Cekiso',
            firstname: 'Nkuli',
            password: 12345
        })
        

        assert.equal('success', response.body.data);

    });
    it('should let user login', async () => {

        const response = await supertest(app).post('/api/login').send({
                username: 'mogerl',
                password: 12345,

            });

        assert.equal(true,response.body.success);

    });
    it('should be able to add a movie to the users playlist', async () => {
        const response = await supertest(app)
        .post('/api/login')
        .send({
            username: 'mogerl',
            password: 12345

        });
        // console.log(response.body.user.userid + 'hello mama');
    const id = response.body.user.userid



        const checkingPlaylist = await supertest(app)

            .post('/api/playlist')
            .send({
                movie_id: 9494,
                movie_title: "Look Who's Talking",
                img: "/k60x5YEOox9P9vWITSHFSkLGecN.jpg",
                user_id: id 
            });

        assert.equal("success", checkingPlaylist.body.status);

    });
    it('should be able to display with the user id', async () => {
        const response = await supertest(app)
            .post('/api/login')
            .send({
                username: 'mogerl',
                password: 12345

            });
        const id = response.body.user.userid
        const responseID = await supertest(app)
            .get('/api/playlist/' + id)
            .expect(200);
        const movies=responseID.body.result
        const movieOnly=movies.map(movie => {
            return movie.movie_title
        })

        assert.equal(`Look Who's Talking`, movieOnly);


    });

    after(() => {
        db.$pool.end();
    });
})