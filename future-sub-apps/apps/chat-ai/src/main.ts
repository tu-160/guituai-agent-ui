import { createApp } from 'vue';

import '@future/styles';
import { unmountGlobalLoading } from '@future/utils';

import { setupStore } from '@/store';
import Antd from 'ant-design-vue';

import App from './App.vue';
import router from './router/index';

import 'ant-design-vue/dist/reset.css';
import { i18n } from './locales/i18n'; // 引入 i18n 实例

const app = createApp(App);
// 配置 store
setupStore(app);
app.use(router);
app.use(Antd);
app.use(i18n)
app.mount('#app');

unmountGlobalLoading();
