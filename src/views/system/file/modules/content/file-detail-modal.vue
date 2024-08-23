<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { $t } from '@/locales';
import type { FileItem } from '@/apis';
import { formatFileSize } from '@/utils';
import FileImage from './file-image.vue';

defineOptions({
  name: 'FileDetailModal'
});

const fileItem = defineModel<FileItem>('fileItem', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

const getFileName = (item: FileItem) => {
  return `${item.name}${item.extension ? `.${item.extension}` : ''}`;
};

// 关闭窗口
function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="w-300px"
    title="文件详情"
    segmented
    close-on-esc
    @after-leave="closeDrawer"
  >
    <NRow justify="center">
      <FileImage :data="fileItem" class="mb-20px h-auto w-268px" />
    </NRow>
    <NRow class="mt-15px">
      <NDescriptions :column="1" label-class="!color-#666666 text-size-0.8rem">
        <NDescriptionsItem label="名称">
          <CopyText v-model:value="fileItem.url" :show-text="getFileName(fileItem)"></CopyText>
        </NDescriptionsItem>
        <NDescriptionsItem label="大小">{{ formatFileSize(fileItem.size) }}</NDescriptionsItem>
        <NDescriptionsItem label="上传时间">{{ fileItem.createTime }}</NDescriptionsItem>
        <NDescriptionsItem label="修改时间">{{ fileItem.updateTime }}</NDescriptionsItem>
        <NDescriptionsItem label="存储名称">{{ fileItem.storageName }}</NDescriptionsItem>
      </NDescriptions>
    </NRow>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
