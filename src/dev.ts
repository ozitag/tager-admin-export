import Vue, { CreateElement } from 'vue';
import VueCompositionApi, { createApp } from '@vue/composition-api';

import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import { AdminLayoutPlugin, createRouter } from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import EN from './locales/en';
import RU from './locales/ru';
import config from './config/config.json';
import App from './views/App.vue';
import { EXPORT_LIST_ROUTE, EXPORT_FORM_ROUTE } from './constants/routes';

configStore.setConfig(config);

const router = createRouter(
  {
    routes: [EXPORT_LIST_ROUTE, EXPORT_FORM_ROUTE],
  },
  { useTitleSync: false }
);

i18n.addTranslations('en', 'export', EN);
i18n.addTranslations('ru', 'export', RU);

i18n.init({ debug: false, lng: 'ru' }).then(() => {
  Vue.use(VueCompositionApi);

  const app = createApp({
    router,
    render: (h: CreateElement) => h(App),
  });

  app.use(i18n.getPlugin());
  app.use(AdminUiPlugin);
  app.use(AdminLayoutPlugin);

  app.mount('#app');
});
