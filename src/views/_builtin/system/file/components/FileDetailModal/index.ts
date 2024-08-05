import { h } from 'vue';
import type { FileItem } from '@/apis';
import ModalContent from './ModalContent.vue';

/** 打开 详情 弹窗 */
export function openFileDetailModal(fileItem: FileItem) {
  return window.$dialog?.info({
    title: '文件详情',
    content: () => h(ModalContent, { data: fileItem })
  });
}
