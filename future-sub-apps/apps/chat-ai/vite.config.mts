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
            target: 'http://localhost:30061/api',
            ws: true,
          },
        },
      },
    },
  };
});
