import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store/index';
import './assets/main.css';
const app = createApp(App);

app.config.globalProperties.$http = axios;
axios.defaults.baseURL = 'https://iapitest.eva.guru';

app.use(router);
app.use(store);

app.mount('#app');
