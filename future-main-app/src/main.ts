import 'ant-design-vue/dist/reset.css';
import '@/design/index.less';
import '@/design/windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { setupErrorHandle } from '@/logics/error-handle';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
import { setupGlobDirectives } from '@/directives';
import { setupI18n } from '@/locales/setupI18n';
import { registerGlobComp } from '@/components/registerGlobComp';
import gridLayout from 'vue-grid-layout';
import mitt from '@/utils/mitt';
// 修复打印插件会一直自动连接websocket的问题
import { disAutoConnect } from 'vue-plugin-hiprint';
import WujieVue from "wujie-vue3";

disAutoConnect();

const emitter = mitt();

async function bootstrap() {
  const app = createApp(App);

  app.provide('emitter', emitter); // 注入provider

  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  app.use(gridLayout);

  app.use(WujieVue);
  app.mount('#app');
}

bootstrap();
