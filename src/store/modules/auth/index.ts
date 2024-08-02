import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { accountLogin, getUserInfo } from '@/apis/auth';
import type { AccountLoginReq, LoginResp, UserInfo } from '@/apis/auth/type';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: UserInfo = reactive({
    id: '',
    username: '',
    nickname: '',
    gender: 0,
    email: '',
    phone: '',
    avatar: '',
    pwdResetTime: '',
    pwdExpired: false,
    registrationDate: '',
    deptName: '',
    roles: [],
    permissions: [],
    buttons: []
  });
  // buttons: []

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(accountLoginReq: AccountLoginReq, redirect = true) {
    startLoading();
    const { data: loginResp, error } = await accountLogin(accountLoginReq);
    if (!error) {
      const pass = await loginByToken(loginResp);
      if (pass) {
        await routeStore.initAuthRoute();
        if (redirect) {
          await redirectFromLogin();
        }
        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: userInfo.nickname }),
            duration: 4500
          });
        }
      }
    } else {
      resetStore();
    }
    endLoading();
    return error;
  }

  async function loginByToken(loginResp: LoginResp) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginResp.token);
    localStg.set('refreshToken', loginResp.token);

    // 2. get user info
    const pass = await getUserAccount();

    if (pass) {
      token.value = loginResp.token;

      return true;
    }

    return false;
  }

  async function getUserAccount() {
    const { data: info, error } = await getUserInfo();
    if (!error) {
      // update store
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserAccount();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
