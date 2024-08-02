import type { App } from 'vue';
import hasPerm from './permission/hasPerm';
import hasRole from './permission/hasRole';
import copy from './copy';

export default {
  install(Vue: App) {
    Vue.directive('permission', hasPerm);
    Vue.directive('role', hasRole);
    Vue.directive('copy', copy);
  }
};
