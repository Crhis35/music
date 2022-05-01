import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import VeeValidatePlugin from './includes/validation';
import { getAuth, onAuthStateChanged } from './includes/firebase';

import './assets/tailwind.css';
import './assets/main.css';
import IconDirective from './directives/icon';
import i18n from './includes/i18n';
import './registerServiceWorker';
import GlobalComponents from './includes/_global';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router);

const auth = getAuth();
let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(i18n);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon', IconDirective);

    app.mount('#app');
  }
});
