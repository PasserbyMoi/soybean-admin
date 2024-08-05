<script setup lang="ts">
import type { FileItem } from '@/apis';
import { formatFileSize } from '@/utils';
import FileImage from '../../main/FileMain/FileImage.vue';

interface Props {
  data: FileItem;
}

withDefaults(defineProps<Props>(), {});

// 文件名称带后缀
const getFileName = (item: FileItem) => {
  return `${item.name}${item.extension ? `.${item.extension}` : ''}`;
};
</script>

<template>
  <NRow justify="center" align="center">
    <div class="h-100px">
      <FileImage :data="data" style="border-radius: 5px" />
    </div>
  </NRow>
  <NRow class="mt-15px">
    <NDescriptions :column="1" layout="inline-vertical">
      <NDescriptionsItem label="名称">
        <CopyText :value="data.url">{{ getFileName(data) }}</CopyText>
      </NDescriptionsItem>
      <NDescriptionsItem label="大小">{{ formatFileSize(data.size) }}</NDescriptionsItem>
      <NDescriptionsItem label="上传时间">{{ data.createTime }}</NDescriptionsItem>
      <NDescriptionsItem label="修改时间">{{ data.updateTime }}</NDescriptionsItem>
      <NDescriptionsItem label="存储名称">{{ data.storageName }}</NDescriptionsItem>
    </NDescriptions>
  </NRow>
</template>

<style lang="scss" scoped>
.label {
  color: var(--color-text-2);
}
:deep(.arco-form-item) {
  margin-bottom: 0;
}
:deep(.arco-form-item-label-col > label) {
  white-space: nowrap;
}
:deep(.arco-descriptions-title) {
  font-size: 14px;
}
:deep(.arco-descriptions-item-label-inline) {
  font-size: 12px;
}
:deep(.arco-descriptions-item-value-inline) {
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
