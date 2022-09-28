const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt");

module.exports = function name(app, db) {
  
    app.post('/api/login', async function(req, res) {

        try {
            const { username, password } = req.body
            const logedin = await db.oneOrNone("select * from users where username = $1", [username])
            const passwordChecking = await db.oneOrNone("select password from users where username=$1", [username])
            const findId = await db.oneOrNone("select user_id from users where username=$1", [username])
            console.log(logedin);
            if (logedin && passwordChecking.password == password) {
                jwt.sign({ logedin }, 'secretkey', (err, token) => {
                    return res.json({
                        success: true,
                        user: {
                            firstname: 'Nkuli',
                            lastname: 'Cekiso',
                            username: 'mogerl',
                            password: 12345,
                            userid: findId.user_id,

                        },
                        
                        access_token: token,
                    

                    })
                   

                })
                // console.log(user_id + ' yellow mellow')


            } else if (logedin && passwordChecking.password != password) {
                return res.json({
                    success: false,
                    status: "Wrong password",
                    user: null,
                    access_token: null
                })
            } else if (!logedin)
                return res.json({
                    success: false,
                    user: null,
                    access_token: null
                })
        } catch (error) {
            console.log(error);

        }



    })
    app.post('/api/register', async function(req, res) {
          
            try {
                  const { username, lastname, firstname, password } = req.body
            var singUp = await db.manyOrNone("select * from users where username = $1 and lastname=$2 and firstname=$3 and password=$4", [username, lastname, firstname, password])
            await db.none("insert into users(username, lastname, firstname, password) values ($1 , $2, $3, $4)", [username, lastname, firstname, password])
            res.json({
                data: "success"
            })
            } catch (error) {
            console.log(error);
                
            }


        })
        // movies api
    app.post('/api/playlist', async function(req, res) {
     try {
        const { movie_id, movie_title, img, user_id } = req.body
        // var addPlaylist = await db.none("insert into user_movies (movie_id, movie_title, img, user_id) values ($1 ,$2 ,$3, $4)", [movie_id, movie_title, img, user_id])
        var checkDuplicate= await db.oneOrNone("select * from user_movies where movie_id = $1",[movie_id])
        if(!checkDuplicate){
            var addPlaylist = await db.none("insert into user_movies (movie_id, movie_title, img, user_id) values ($1 ,$2 ,$3, $4)", [movie_id, movie_title, img, user_id])
            res.json({
                status: "success",
            })
        }  
     } catch (error) {
        console.log(error);
     }
        console.log(addPlaylist);
    })

    app.get('/api/playlist/:user', async function(req, res) {

  
        try {
            let favMovies = []
            const userid = Number(req.params.user)
    
            favMovies = await db.manyOrNone("select * from user_movies where user_id =$1", [userid])
            res.json({
                result: favMovies
            })  
        } catch (error) {
            console.log(error);
        }
    })

    app.delete('/api/playlist/:id', async function(req, res) {


        try {
            
        const { id } = req.params;
        // delete the garments with the specified gender
        // const garment = []
        const results = await db.oneOrNone("delete from user_movies where id = $1", [id])

        res.json({
            status: 'success',
            data: results
        })
        } catch (error) {
            console.log(error);
        }

    });

}