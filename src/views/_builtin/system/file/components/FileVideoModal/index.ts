import { h } from 'vue';
import type { FileItem } from '@/apis';
import ModalContent from './ModalContent.vue';

export function previewFileVideoModal(data: FileItem) {
  return window.$dialog?.info({
    title: '视频播放',
    content: () => h(ModalContent, { data })
  });
}
