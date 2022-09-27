import axios from "axios";

export default function moviesApp() {
    return {
        nav:false,
        createAcc:false,
        logUser:true,
        username: null,
        usernameReg: null,
        passwordReg: null,
        firstname: null,
        lastname: null,
        password: null,
        enterOpen: false,
        playlistOpen: false,
        displayMovies:false,
        displayResults:false,
        favoriteMovies:false,
        signUp:true,
        Login:false,
        movie_name: null,
        movies: [],
        favPlaylists: [],
        original_title: null,
        movie_id: null,
        poster_img: null,
        user: null,
        // errors
        errorText: '',
        successErr: '',
        user:'',
        loginSuccessMsg: null,
        noMovies: null,
        registerSuccessMsg:null,
        addedList:null,
     //working on the login button 


     init() {
        console.log(localStorage['users']);
        if (localStorage['user'] !== undefined) {

           
            this.logUser= false
            this.user = JSON.parse(localStorage.getItem('user'));
            console.log("------------------", this.user)
            console.log(this.user.role)
            this.signIn.username = this.user.username
            if (this.user === "users") {
                this.displayMovies=false
                this.displayResults=true
                this.nav= true
            } 
        }
    },
        logIn() {
           
            const username = this.username
            const password = this.password
            axios

                .post("http://localhost:4554/api/login", { username, password })
                .then((users) => {
                               
                                const { userInfo } = users.data
                            
                                var { access_token } = users.data
                                    // console.log(access_token);
                                if (users.data.success == true) {
                                    this.loginSuccessMsg = 'Successfully login'
                                    this.displayMovies = false
                                    this.displayResults=true
                                    this.nav = true
                                    this.logUser = false
                                    // this.favoriteMovies= false
                                    this.token = access_token
                                    this.user = users.data.user.userid
            
                                    console.log(this.user + "", "xdcfghujki");
                        localStorage.setItem('access_token', this.token)

                    } else if(!userInfo) {
                        // this.logUser = false
                        // this.enterOpen = false
                        // this.errorText = 'Please sign up'
                        // this.username = ''
                        // this.password = ''
                        return false
                      
                    }
                    
                    

                })
                setTimeout(() => {
                    this.loginSuccessMsg = '';
                }, 3000);
        },
 
        register() {
            const username = this.usernameReg
            const password = this.passwordReg
            const firstname = this.firstname
            const lastname = this.lastname

            axios
                .post("http://localhost:4554/api/register", {
                    username,
                    password,
                    firstname,
                    lastname
                })
                // .then(App => App.json())
                .then({
                    username: this.username,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    password: this.password
                })
                .then(App => console.log(App.data))
             this.registerSuccessMsg = 'Successfully registered'
            this.usernameReg = ''
            this.passwordReg = ''
            this.firstname = ''
            this.lastname = ''
            
            setTimeout(() => {
                this.registerSuccessMsg = '';
            }, 3000);
        },
        logOut(){
            localStorage.clear();
            this.logUser = true
            this.displayMovies=false
            this.favPlaylists = false
            this.favoriteMovies =false
            location.reload();
        },
        maindisplay(){
            axios
                .get(`https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movies}`)
                .then((App)=>{
                    this.movies = App.data.results
                })

        },
        playlist() {

            axios
                .get(`https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movie_name}`)

            .then((App) => {
              
                console.log(App.data.results);
                // this.movies = App.data.results
                // console.log(this.movies);
                if (App.data.results != 0) {
                this.movies = App.data.results
                this.displayMovies = true
               
                    
                }else{
                    this.noMovies = 'No results'
                  
                 return false
                }
            })
            setTimeout(() => {
                this.noMovies = '';
            }, 3000);

        },
        favouriteMovie() {

            console.log(this.original_title);
            console.log(this.movie_id);
            console.log(this.poster_img);
            const movie_id = this.movie_id
            const movie_title = this.original_title
            const img = this.poster_img
            const user_id = this.user

            axios

                .post("http://localhost:4554/api/playlist", { movie_id, movie_title, img, user_id })
                .then((App) => {
                    console.log(App.data);
                // this.addedList='successfully added'
//                  if(this.movies.indexOf(App.data) === -1){
//                     this.movies.push(App.data)
//                  }
// console.log('am about to work' + this.movies);
                })
                setTimeout(() => {
                    this.addedList = '';
                }, 3000);

        },
        Addplaylist() {
            axios
                .get(`http://localhost:4554/api/playlist/${this.user}`)
                .then((App) => {
                  
                    console.log(App.data);
                    this.favPlaylists = App.data.result
                    this.movies= false

                })


        },
        //to do today 
        deleteMovie(element) {

            try {
                // console.log(this.id);
                axios.delete(`http://localhost:4554/api/playlist/${element.id}`)


                .then(() => this.Addplaylist())
                    // .then(console.log(this.addClothing))
            } catch (error) {

            }
        },

    }

}