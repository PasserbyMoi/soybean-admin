import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

/**
 * v-permission 操作权限处理
 *
 * 使用 v-permission="['system:user:add']"
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const userStore = useAuthStore();
  const { value } = binding;
  const all_permission = '*:*:*';

  if (value && Array.isArray(value) && value.length) {
    const permissionValues: string[] = value;
    const hasPermission = userStore.userInfo.permissions.some(perm => {
      return all_permission === perm || permissionValues.includes(perm);
    });
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  } else {
    throw new Error(`need permission! Like v-hasPerm="['home:btn:edit','home:btn:delete']"`);
  }
}

const directive: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  }
};

export default directive;
