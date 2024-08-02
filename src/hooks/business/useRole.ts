import { ref } from 'vue';
import { listRoleDict } from '@/apis';

/** 角色模块 */
export function useRole(options?: { onSuccess?: () => void }) {
  const loading = ref(false);
  const roleList = ref<CommonType.EOption[] | null>([]);

  const getRoleList = async () => {
    try {
      loading.value = true;
      const { data, error } = await listRoleDict();
      if (error) {
        window.$message?.error('获取角色信息失败');
      } else {
        roleList.value = data;
        options?.onSuccess && options.onSuccess();
      }
    } finally {
      loading.value = false;
    }
  };
  return { roleList, getRoleList, loading };
}
