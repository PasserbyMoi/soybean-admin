import { ref } from 'vue';
import type { ArcoTreeNodeData } from '@/apis';
import { listMenuTree } from '@/apis';

/** 菜单模块 */
export function useMenu(options?: { onSuccess?: () => void }) {
  const loading = ref(false);
  const menuList = ref<ArcoTreeNodeData[]>([]);
  const menuKeys = ref<number[]>([]);

  const getMenuList = async (name?: string) => {
    try {
      loading.value = true;
      const { data, error } = await listMenuTree({ description: name ?? '' });
      if (!error) {
        menuList.value = data;
        options?.onSuccess && options.onSuccess();
        menuKeys.value = flatten(menuList.value);
      } else {
        window.$message?.error('获取菜单信息失败');
      }
    } finally {
      loading.value = false;
    }
  };

  function flatten(items: ArcoTreeNodeData[]): number[] {
    let res: number[] = [];
    for (const item of items) {
      const childrens = item.children;
      if (childrens && childrens.length) {
        res = res.concat(flatten(childrens));
      }
      res.push(item.key);
    }
    return res;
  }

  return { menuList, menuKeys, getMenuList, loading };
}
