import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import store from './store/store'
import '@vueform/multiselect/themes/default.css'

createApp(App)
  .use(store)
  .mount('#app');