
        <tamplate x-for="movies in movies">
            <input type="text" x-model="movie_name"> <button @click="playlist()">Search</button>

            <img :src="`https://image.tmdb.org/t/p/w500${movies.poster_path}`">
            <p x-text="movies.title"></p>
            <p x-text="movies.release_date"></p>
        </tamplate>