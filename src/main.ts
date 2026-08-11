import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCss3,
  faCss3Alt,
  faGithub,
  faHtml5,
  faJs,
  faLaravel,
  faPhp,
  faPython,
  faTelegram,
  faVuejs,
} from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'

// Local fonts (bundled, no Google CDN)
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/cyrillic-500.css'
import '@fontsource/manrope/cyrillic-600.css'
import '@fontsource/manrope/cyrillic-700.css'
import '@fontsource/syncopate/400.css'
import '@fontsource/syncopate/700.css'

import './style.css'
import 'lenis/dist/lenis.css'

library.add(
  faPhp,
  faLaravel,
  faVuejs,
  faJs,
  faCss3Alt,
  faCss3,
  faHtml5,
  faPython,
  faGithub,
  faTelegram,
  faEnvelope,
  faArrowUpRightFromSquare,
)

const app = createApp(App)
app.use(MotionPlugin)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
