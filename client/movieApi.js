import axios from "axios";

export default function moviesApp() {
    return {
        nav: false,
        createAcc: false,
        logUser: true,
        username: null,
        usernameReg: null,
        passwordReg: null,
        firstname: null,
        lastname: null,
        password: null,
        enterOpen: false,
        playlistOpen: false,
        displayMovies: false,
        displayResults: false,
        favoriteMovies: false,
        signUp: false,
        Login: false,
        movie_name: null,
        movies: [],
        favPlaylists: [],
        original_title: null,
        movie_id: null,
        poster_img: null,
        user: null,
        token: null,
        // errors
        errorText: '',
        successErr: '',
        loginSuccessMsg: null,
        noMovies: null,
        registerSuccessMsg: null,
        addedList: null,

        init() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.logUser = false;
                this.user = JSON.parse(storedUser);
                console.log("------------------", this.user);
            }
        },

        logIn() {
            const username = this.username;
            const password = this.password;
            
            // FIXED: Changed port from 4554 to 4545
            axios.post("http://localhost:4545/api/login", { username, password })
                .then((response) => {
                    console.log('Login response:', response.data);
                    
                    if (response.data.success === true) {
                        this.loginSuccessMsg = 'Successfully logged in';
                        this.displayMovies = false;
                        this.displayResults = true;
                        this.nav = true;
                        this.logUser = false;
                        
                        // FIXED: Correct property access
                        this.token = response.data.access_token;
                        this.user = response.data.user.userid;
                        
                        console.log("User ID:", this.user);
                        
                        // Store in localStorage
                        localStorage.setItem('access_token', this.token);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        
                        // Clear form
                        this.username = '';
                        this.password = '';
                    }
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    this.errorText = error.response?.data?.message || 'Login failed. Please check your credentials.';
                    
                    setTimeout(() => {
                        this.errorText = '';
                    }, 3000);
                });
                
            setTimeout(() => {
                this.loginSuccessMsg = '';
            }, 3000);
        },

        register() {
            const username = this.usernameReg;
            const password = this.passwordReg;
            const firstname = this.firstname;
            const lastname = this.lastname;

            
            axios.post("http://localhost:4545/api/register", {
                    username,
                    password,
                    firstname,
                    lastname
                })
                .then((response) => {
                    console.log('Registration response:', response.data);
                    
                    if (response.data.success) {
                        this.registerSuccessMsg = 'Successfully registered! Please login.';
                        this.usernameReg = '';
                        this.passwordReg = '';
                        this.firstname = '';
                        this.lastname = '';
                    }
                })
                .catch((error) => {
                    console.error('Registration error:', error);
                    this.errorText = error.response?.data?.message || 'Registration failed';
                    
                    setTimeout(() => {
                        this.errorText = '';
                    }, 3000);
                });
            
            setTimeout(() => {
                this.registerSuccessMsg = '';
            }, 3000);
        },

        logOut() {
            localStorage.clear();
            this.logUser = true;
            this.displayMovies = false;
            this.favPlaylists = false;
            this.favoriteMovies = false;
            location.reload();
        },

        maindisplay() {
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movies}`)
                .then((App) => {
                    this.movies = App.data.results;
                });
        },

        playlist() {
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movie_name}`)
                .then((App) => {
                    console.log(App.data.results);
                    
                    if (App.data.results.length > 0) {
                        this.movies = App.data.results;
                        this.displayMovies = true;
                    } else {
                        this.noMovies = 'No results';
                    }
                })
                .catch((error) => {
                    console.error('Search error:', error);
                    this.noMovies = 'Search failed';
                });
            
            setTimeout(() => {
                this.noMovies = '';
            }, 3000);
        },

        favouriteMovie() {
            const movie_id = this.movie_id;
            const movie_title = this.original_title;
            const img = this.poster_img;
            const user_id = this.user;

            
            axios.post("http://localhost:4545/api/playlist", { 
                    movie_id, 
                    movie_title, 
                    img, 
                    user_id 
                })
                .then((App) => {
                    console.log(App.data);
                    this.addedList = 'Successfully added';
                    
                    if (this.movies.indexOf(App.data) === -1) {
                        this.movies.push(App.data);
                    }
                })
                .catch((error) => {
                    console.error('Add to playlist error:', error);
                    this.errorText = 'Failed to add movie';
                });
            
            setTimeout(() => {
                this.addedList = '';
            }, 3000);
        },

        Addplaylist() {
            
            axios.get(`http://localhost:4545/api/playlist/${this.user}`)
                .then((App) => {
                    console.log(App.data);
                    this.favPlaylists = App.data.result;
                    this.movies = false;
                })
                .catch((error) => {
                    console.error('Fetch playlist error:', error);
                });
        },

        deleteMovie(element) {
            
            axios.delete(`http://localhost:4545/api/playlist/${element.id}`)
                .then(() => this.Addplaylist())
                .catch((error) => {
                    console.error('Delete error:', error);
                });
        },
    }
}