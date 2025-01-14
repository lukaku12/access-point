import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/assets/main.css';
import 'uno.css';

const app: VueApp = createApp(App);
app.use(router);
app.mount('#app');
