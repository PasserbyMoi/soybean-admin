import { h, ref } from 'vue';
import { type FileItem, updateFile } from '@/apis';
import ModalContent from './ModalContent.vue';

export function openFileRenameModal(data: FileItem, callback?: () => void) {
  const ModalContentRef = ref<InstanceType<typeof ModalContent>>();
  return window.$dialog?.info({
    title: '重命名',
    content: () =>
      h(ModalContent, {
        data,
        ref: e => {
          ModalContentRef.value = e as any;
        }
      }),
    onBeforeOk: async () => {
      const isInvalid = await ModalContentRef.value?.formRef?.validate();
      const modelParams = ModalContentRef.value?.formRef?.model;
      if (isInvalid) return false;
      await updateFile({ name: modelParams?.name }, data.id);
      window.$message?.success('重命名成功');
      if (callback) {
        callback();
      }
      return true;
    }
  });
}
