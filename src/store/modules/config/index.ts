import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import type { BasicConfig } from '@/apis';
import { listOptionDict } from '@/apis';

export const useConfigStore = defineStore(
  SetupStoreId.Config,
  () => {
    // 系统配置配置
    const siteConfig = reactive({}) as BasicConfig;

    // 初始化系统配置
    const initSiteConfig = async () => {
      await listOptionDict({
        category: 'SITE'
      }).then(res => {
        siteConfig.SITE_FAVICON = res.data?.filter(o => o.label === 'SITE_FAVICON')[0].value;
        siteConfig.SITE_LOGO = res.data?.filter(o => o.label === 'SITE_LOGO')[0].value;
        siteConfig.SITE_TITLE = res.data?.filter(o => o.label === 'SITE_TITLE')[0].value;
        siteConfig.SITE_COPYRIGHT = res.data?.filter(o => o.label === 'SITE_COPYRIGHT')[0].value;
        siteConfig.SITE_BEIAN = res.data?.filter(o => o.label === 'SITE_BEIAN')[0].value;
        document.title = res.data?.filter(o => o.label === 'SITE_TITLE')[0].value;
        document
          .querySelector('link[rel="shortcut icon"]')
          ?.setAttribute('href', res.data?.filter(o => o.label === 'SITE_FAVICON')[0].value || '/favicon.ico');
      });
    };

    // 设置系统配置
    const setSiteConfig = (config: BasicConfig) => {
      Object.assign(siteConfig, config);
      document.title = config.SITE_TITLE || '';
      document.querySelector('link[rel="shortcut icon"]')?.setAttribute('href', config.SITE_FAVICON || '/favicon.ico');
    };

    const getFavicon = () => {
      return siteConfig.SITE_FAVICON;
    };

    const getLogo = () => {
      return siteConfig.SITE_LOGO;
    };

    const getTitle = () => {
      return siteConfig.SITE_TITLE;
    };

    const getCopyright = () => {
      return siteConfig.SITE_COPYRIGHT;
    };

    const getBeian = () => {
      return siteConfig.SITE_BEIAN;
    };

    // init
    initSiteConfig();

    return {
      ...toRefs(siteConfig),
      initSiteConfig,
      setSiteConfig,
      getFavicon,
      getLogo,
      getTitle,
      getCopyright,
      getBeian
    };
  },
  { persist: true }
);
