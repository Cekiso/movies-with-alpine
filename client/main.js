import './style.css'
import './movies.css'
import Alpine from 'alpinejs'

import moviesApp from './movieApi'
Alpine.data('enterOpen', moviesApp)

// import "mocha";
// mocha.setup({ ui: "bdd" });

// import test from 'tests'


window.Alpine = Alpine

Alpine.start()
document.querySelector('#app').innerHTML = `
  <h1>Movies Vite</h1>

`