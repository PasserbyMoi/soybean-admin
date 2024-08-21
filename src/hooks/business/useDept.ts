import { ref } from 'vue';
import type { ArcoTreeNodeData } from '@/apis';
import { listDeptTree } from '@/apis';

/** 部门模块 */
export function useDept(options?: { onSuccess?: () => void }) {
  const loading = ref(false);
  const deptList = ref<ArcoTreeNodeData[]>([]);
  const deptKeys = ref<string[]>([]);

  const getDeptList = async (name?: string) => {
    try {
      loading.value = true;
      const { data, error } = await listDeptTree({ description: name ?? '' });
      if (!error) {
        deptList.value = data;
        options?.onSuccess && options.onSuccess();
        deptKeys.value = flatten(deptList.value);
      } else {
        window.$message?.error('获取部门信息失败');
      }
    } finally {
      loading.value = false;
    }
  };
  return { deptList, deptKeys, getDeptList, loading };
}

function flatten(items: ArcoTreeNodeData[]): string[] {
  let res: string[] = [];
  for (const item of items) {
    const childrens = item.children;
    if (childrens && childrens.length) {
      res = res.concat(flatten(childrens));
    }
    res.push(`${item.key}`);
  }
  return res;
}
