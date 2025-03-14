// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/styles/main.scss';
import App from './App.vue';
import { i18n } from './i18n';

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.mount('#app');
