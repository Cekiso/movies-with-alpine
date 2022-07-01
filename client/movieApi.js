import axios from "axios";

export default function moviesApp() {
    return {
        username: null,
        usenameReg: null,
        passwordReg: null,
        firstname: null,
        lastname: null,
        password: null,
        enterOpen: false,
        playlistOpen: false,
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




        logIn() {
            const username = this.username
            const password = this.password
            axios

                .post("http://localhost:4554/api/login", { username, password })
                .then((App) => {
                    console.log(App.data);
                    var { access_token } = App.data
                        // console.log(access_token);

                    if (App.data.success == true) {
                        this.enterOpen = true
                        this.token = access_token
                        this.user = App.data.user.userid

                        console.log(this.user + "", "xdcfghujki");

                        this.errorText = 'Logged In'

                        localStorage.setItem('access_token', this.token)

                    } else {
                        this.enterOpen = false
                        this.errorText = 'Please sign up'
                        this.username = ''
                        this.password = ''


                    }

                })
        },
        Register() {
            const username = this.usenameReg
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
            this.successErr = 'Successfully added'
            this.usernameReg = ''
            this.passwordReg = ''
            this.firstname = ''
            this.lastname = ''
        },
        playlist() {

            axios
                .get(`https://api.themoviedb.org/3/search/movie?api_key=02d4c4c93174c2c6c4871f23e91933c6&query=${this.movie_name}`)

            .then((App) => {
                console.log(App.data.results);
                this.movies = App.data.results
                console.log(this.movies);
            })

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


                })

        },
        Addplaylist() {
            axios
                .get(`http://localhost:4554/api/playlist/${this.user}`)
                .then((App) => {
                    console.log(App.data);
                    this.favPlaylists = App.data.result


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