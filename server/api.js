// const jwt = require("jsonwebtoken")
// // const bcrypt = require("bcrypt");

// module.exports = function name(app, db) {
  
//     app.post('/api/login', async function(req, res) {

//         try {
//             const { username, password } = req.body
//             const logedin = await db.oneOrNone("select * from users where username = $1", [username])
//             const passwordChecking = await db.oneOrNone("select password from users where username=$1", [username])
//             const findId = await db.oneOrNone("select user_id from users where username=$1", [username])
//             console.log(logedin);
//             if (logedin && passwordChecking.password == password) {
//                 jwt.sign({ logedin }, 'secretkey', (err, token) => {
//                     return res.json({
//                         success: true,
//                         user: {
//                             firstname: 'Nkuli',
//                             lastname: 'Cekiso',
//                             username: 'mogerl',
//                             password: 12345,
//                             userid: findId.user_id,

//                         },
                        
//                         access_token: token,
                    

//                     })
                   

//                 })
//                 // console.log(user_id + ' yellow mellow')


//             } else if (logedin && passwordChecking.password != password) {
//                 return res.json({
//                     success: false,
//                     status: "Wrong password",
//                     user: null,
//                     access_token: null
//                 })
//             } else if (!logedin)
//                 return res.json({
//                     success: false,
//                     user: null,
//                     access_token: null
//                 })
//         } catch (error) {
//             console.log(error);

//         }



//     })
//     app.post('/api/register', async function(req, res) {
          
//             try {
//                   const { username, lastname, firstname, password } = req.body
//             var singUp = await db.manyOrNone("select * from users where username = $1 and lastname=$2 and firstname=$3 and password=$4", [username, lastname, firstname, password])
//             await db.none("insert into users(username, lastname, firstname, password) values ($1 , $2, $3, $4)", [username, lastname, firstname, password])
//             res.json({
//                 data: "success"
//             })
//             } catch (error) {
//             console.log(error);
                
//             }


//         })
//         // movies api
//     app.post('/api/playlist', async function(req, res) {
//      try {
//         const { movie_id, movie_title, img, user_id } = req.body
//         // var addPlaylist = await db.none("insert into user_movies (movie_id, movie_title, img, user_id) values ($1 ,$2 ,$3, $4)", [movie_id, movie_title, img, user_id])
//         var checkDuplicate= await db.oneOrNone("select * from user_movies where movie_id = $1",[movie_id])
//         if(!checkDuplicate){
//             var addPlaylist = await db.none("insert into user_movies (movie_id, movie_title, img, user_id) values ($1 ,$2 ,$3, $4)", [movie_id, movie_title, img, user_id])
//             res.json({
//                 status: "success",
//             })
//         }  
//      } catch (error) {
//         console.log(error);
//      }
//         console.log(addPlaylist);
//     })

//     app.get('/api/playlist/:user', async function(req, res) {

  
//         try {
//             let favMovies = []
//             const userid = Number(req.params.user)
    
//             favMovies = await db.manyOrNone("select * from user_movies where user_id =$1", [userid])
//             res.json({
//                 result: favMovies
//             })  
//         } catch (error) {
//             console.log(error);
//         }
//     })

//     app.delete('/api/playlist/:id', async function(req, res) {


//         try {
            
//         const { id } = req.params;
//         // delete the garments with the specified gender
//         // const garment = []
//         const results = await db.oneOrNone("delete from user_movies where id = $1", [id])

//         res.json({
//             status: 'success',
//             data: results
//         })
//         } catch (error) {
//             console.log(error);
//         }

//     });

// }

export default function API(app, db) {
    
    // Register new user
    app.post('/api/register', async (req, res) => {
        const { firstname, lastname, username, password } = req.body;
        
        try {
            const result = await db.one(
                'INSERT INTO users(firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING user_id, username',
                [firstname, lastname, username, password]
            );
            
            res.json({ 
                success: true, 
                user: result 
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({ 
                success: false, 
                message: 'Username already exists or registration failed' 
            });
        }
    });

    // Login user
    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;
        
        try {
            const user = await db.one(
                'SELECT user_id as userid, username FROM users WHERE username=$1 AND password=$2',
                [username, password]
            );
            
            res.json({ 
                success: true, 
                user: user,
                access_token: 'temp_token_' + user.userid // Replace with real JWT if needed
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    });

    // Get user's playlist
    app.get('/api/playlist/:userId', async (req, res) => {
        try {
            const movies = await db.any(
                'SELECT * FROM user_movies WHERE user_id=$1',
                [req.params.userId]
            );
            
            res.json({ result: movies });
        } catch (error) {
            console.error('Error fetching playlist:', error);
            res.status(500).json({ 
                error: 'Failed to fetch playlist',
                result: [] 
            });
        }
    });

    // Add movie to playlist
    app.post('/api/playlist', async (req, res) => {
        const { user_id, movie_title, movie_id, img } = req.body;
        
        try {
            const result = await db.one(
                'INSERT INTO user_movies(user_id, movie_id, movie_title, img) VALUES($1, $2, $3, $4) RETURNING *',
                [user_id, movie_id, movie_title, img]
            );
            
            res.json(result);
        } catch (error) {
            console.error('Error adding movie:', error);
            res.status(400).json({ error: 'Failed to add movie' });
        }
    });

    // Delete movie from playlist
    app.delete('/api/playlist/:id', async (req, res) => {
        try {
            await db.none('DELETE FROM user_movies WHERE id=$1', [req.params.id]);
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting movie:', error);
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    });

    // Logout (optional - mainly frontend clears localStorage)
    app.post('/api/logout', (req, res) => {
        res.json({ success: true, message: 'Logged out successfully' });
    });
}