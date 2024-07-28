import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevtools from 'vite-plugin-vue-devtools';
import progress from 'vite-plugin-progress';
import { setupElegantRouter } from './router';
import { setupUnocss } from './unocss';
import { setupUnplugin } from './unplugin';
import { setupHtmlPlugin } from './html';

export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VueDevtools(),
    setupElegantRouter(),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress(),
    setupHtmlPlugin(buildTime)
  ];

  // use compression
  // if (env.VITE_BUILD_COMPRESS === 'Y') {
  //   const { VITE_COMPRESS_TYPE = 'gzip' } = env
  //   plugins.push(viteCompression({
  //     algorithm: VITE_COMPRESS_TYPE, // 压缩算法
  //   }))
  // }

  return plugins;
}
