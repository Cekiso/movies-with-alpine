-- create table users(
--     user_id serial not null primary key,
--     firstname text,
--     lastname text,
--     username text,
--     password int
-- );

-- create table user_movies(
--     id serial not null primary key,
--     user_id int not null,
--     movie_id int not null,
--     movie_title text,
--     img text,
--     foreign key (user_id)references users(user_id)
-- );

DROP TABLE IF EXISTS user_movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    user_id SERIAL NOT NULL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE user_movies(
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_title TEXT,
    img TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- insert into users (username,firstname,lastname,password) values('Nkuli','Nkululeko','Cekiso',12356);