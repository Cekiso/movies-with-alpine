create table users(
    user_id serial not null primary key,
    firstname text,
    lastname text,
    username text,
    password int
);

create table user_movies(
    id serial not null primary key,
    user_id int not null,
    movie_id int not null,
    movie_title text,
    img text,
    foreign key (user_id)references users(user_id)
);
-- insert into users (username,firstname,lastname,password) values('Nkuli','Nkululeko','Cekiso',12356);