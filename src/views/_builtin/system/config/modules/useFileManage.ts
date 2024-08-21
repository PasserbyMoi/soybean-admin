import { computed, ref } from 'vue';
import type { FileItem } from '@/apis';

export function useFileManage() {
  const mode = ref<NaiveUI.ViewMode>('grid');
  const selectedFileList = ref<FileItem[]>([]); // 已选的文件列表
  const selectedFileIds = ref<Array<string>>([]);

  const isChecked = computed(() => (item: FileItem) => {
    return selectedFileIds.value.includes(item.id);
  });

  // 切换视图
  const toggleMode = () => {
    mode.value = mode.value === 'grid' ? 'table' : 'grid';
  };

  // 添加选择的文件
  const addSelectedFileItem = (item: FileItem) => {
    if (selectedFileIds.value.includes(item.id)) {
      const index = selectedFileList.value.findIndex(i => i.id === item.id);
      selectedFileList.value.splice(index, 1);
      selectedFileIds.value.splice(index, 1);
    } else {
      selectedFileIds.value.push(item.id);
      selectedFileList.value.push(item);
    }
  };

  return {
    mode,
    isChecked,
    selectedFileList,
    selectedFileIds,
    toggleMode,
    addSelectedFileItem
  };
}
