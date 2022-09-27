import './style.css'
import './movies.css'
import Alpine from 'alpinejs'

import moviesApp from './movieApi'
Alpine.data('enterOpen', moviesApp)


window.Alpine = Alpine

Alpine.start()
