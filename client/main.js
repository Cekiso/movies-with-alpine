import './style.css'
import './movies.css'
import Alpine from 'alpinejs'
import moviesApp from '../moviesApp.js';

// Make it available globally for Alpine
window.moviesApp = moviesApp;

import moviesApp from './movieApi'
Alpine.data('enterOpen', moviesApp)


window.Alpine = Alpine

Alpine.start()
