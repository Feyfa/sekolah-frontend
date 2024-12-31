import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AlertPlugin from './plugin/AlertPlugin';
import GlobalPlugin from './plugin/GlobalPlugin';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(AlertPlugin);
app.use(GlobalPlugin);
app.use(ElementPlus)

app.mount('#app')
