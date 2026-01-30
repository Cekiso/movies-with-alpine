import Alpine from 'alpinejs';
import axios from "axios";

// Function to get API base URL
const getApiUrl = () => {
    // In production (Render), use relative URLs
    // In development, use localhost
    return import.meta.env.PROD ? '' : 'http://localhost:4554';
};

const API_BASE = getApiUrl();

Alpine.data('enterOpen', () => ({
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
    // errors
    errorText: '',
    successErr: '',
    loginSuccessMsg: null,
    noMovies: null,
    registerSuccessMsg: null,
    addedList: null,
    token: null,

    // Check if movie is already saved
    isSaved(movieId) {
        return this.favPlaylists && this.favPlaylists.some(movie => movie.movie_id === movieId);
    },

    init() {
        console.log(localStorage['user']);
        if (localStorage['user'] !== undefined) {
            this.logUser = false;
            this.user = JSON.parse(localStorage.getItem('user'));
            console.log("------------------", this.user);
            
            if (this.user) {
                this.displayMovies = false;
                this.displayResults = false;
                this.nav = true;
            }
        }
        
        // Load token if exists
        const token = localStorage.getItem('access_token');
        if (token) {
            this.token = token;
        }
    },

    async logIn() {
        const username = this.username;
        const password = this.password;

        try {
            const response = await axios.post(`${API_BASE}/api/login`, { username, password });
            
            if (response.data.success === true) {
                this.loginSuccessMsg = 'Successfully logged in';
                this.displayMovies = false;
                this.displayResults = true;
                this.nav = true;
                this.logUser = false;
                
                this.token = response.data.access_token;
                this.user = response.data.user.userid;

                console.log(this.user + "", "logged in user");
                
                // Store in localStorage
                localStorage.setItem('access_token', this.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
            } else {
                this.loginSuccessMsg = 'Invalid username or password';
            }
        } catch (error) {
            console.error('Login error:', error);
            this.loginSuccessMsg = 'Login failed. Please try again.';
        }

        setTimeout(() => {
            this.loginSuccessMsg = '';
        }, 3000);
    },

    async register() {
        const username = this.usernameReg;
        const password = this.passwordReg;
        const firstname = this.firstname;
        const lastname = this.lastname;

        try {
            const response = await axios.post(`${API_BASE}/api/register`, {
                username,
                password,
                firstname,
                lastname
            });

            this.registerSuccessMsg = 'Successfully registered! Please login.';
            this.usernameReg = '';
            this.passwordReg = '';
            this.firstname = '';
            this.lastname = '';

            // Switch to login form after 2 seconds
            setTimeout(() => {
                this.createAcc = false;
                this.logUser = true;
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            this.registerSuccessMsg = 'Registration failed. Username may already exist.';
        }

        setTimeout(() => {
            this.registerSuccessMsg = '';
        }, 3000);
    },

    logOut() {
        localStorage.clear();
        this.logUser = true;
        this.displayMovies = false;
        this.favPlaylists = [];
        this.favoriteMovies = false;
        this.nav = false;
        this.user = null;
        this.token = null;
        location.reload();
    },

    async playlist() {
        if (!this.movie_name || this.movie_name.trim() === '') {
            this.noMovies = 'Please enter a search term';
            setTimeout(() => {
                this.noMovies = '';
            }, 3000);
            return;
        }

        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movie_name}`
            );

            console.log(response.data.results);

            if (response.data.results && response.data.results.length > 0) {
                this.movies = response.data.results;
                this.displayMovies = true;
                this.noMovies = '';
            } else {
                this.noMovies = 'No results found';
                this.movies = [];
            }
        } catch (error) {
            console.error('Search error:', error);
            this.noMovies = 'Error searching movies';
        }

        setTimeout(() => {
            this.noMovies = '';
        }, 3000);
    },

    async favouriteMovie() {
        console.log(this.original_title);
        console.log(this.movie_id);
        console.log(this.poster_img);

        const movie_id = this.movie_id;
        const movie_title = this.original_title;
        const img = this.poster_img;
        const user_id = this.user;

        try {
            const response = await axios.post(`${API_BASE}/api/playlist`, { 
                movie_id, 
                movie_title, 
                img, 
                user_id 
            });

            console.log(response.data);
            
            // Add movie to local favPlaylists immediately
            if (!this.isSaved(movie_id)) {
                this.favPlaylists.push({
                    movie_id: movie_id,
                    movie_title: movie_title,
                    img: img,
                    user_id: user_id,
                    id: response.data.id // Get the database ID
                });
            }

            this.addedList = '✓ Successfully added to your library!';

        } catch (error) {
            console.error('Error adding movie:', error);
            this.addedList = '✗ Failed to add movie';
        }

        setTimeout(() => {
            this.addedList = '';
        }, 3000);
    },

    async Addplaylist() {
        if (!this.user) {
            console.log('No user logged in');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE}/api/playlist/${this.user}`);
            
            console.log(response.data);
            this.favPlaylists = response.data.result || [];
            this.movies = false;

        } catch (error) {
            console.error('Error loading playlist:', error);
            this.favPlaylists = [];
        }
    },

    async deleteMovie(element) {
        try {
            await axios.delete(`${API_BASE}/api/playlist/${element.id}`);
            
            // Remove from local array immediately
            this.favPlaylists = this.favPlaylists.filter(movie => movie.id !== element.id);
            
            this.addedList = '✓ Movie removed from library';
            
            setTimeout(() => {
                this.addedList = '';
            }, 3000);

        } catch (error) {
            console.error('Error deleting movie:', error);
            this.addedList = '✗ Failed to remove movie';
            
            setTimeout(() => {
                this.addedList = '';
            }, 3000);
        }
    }
}));

Alpine.start();