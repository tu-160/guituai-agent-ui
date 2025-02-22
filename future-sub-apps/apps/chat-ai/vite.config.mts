import { resolve } from 'node:path';

import { defineConfig } from '@future/vite-config';

function pathResolve(dir: string) {
  // eslint-disable-next-line n/prefer-global/process
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: `${pathResolve('src')}/`,
          },
          {
            find: /#\//,
            replacement: `${pathResolve('types')}/`,
          },
        ],
      },
      server: {
        port: 8000, // 指定启动端口
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            // target: '/api', // 生产环境使用
            // target: 'http://172.20.200.198:30061/api', // 开发环境使用
            target: 'http://127.0.0.1:30061/api', // 本地环境使用
            ws: true,
          },
        },
      },
    },
  };
});
