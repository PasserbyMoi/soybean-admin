<script setup lang="ts">
import { FileIcon, ImageTypes } from '@/constants/file';
import type { FileItem } from '@/apis';

defineOptions({ name: 'FileImage', inheritAttrs: false });

interface Props {
  data: FileItem;
}

const props = withDefaults(defineProps<Props>(), {});

const attrs = useAttrs();

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));

// 是否是图片类型文件
const isImage = computed(() => {
  const extension = props.data.extension.toLowerCase();
  return ImageTypes.includes(extension);
});

// 获取文件图标，如果是图片就显示图片
const getFileImg = computed<string>(() => {
  const extension = props.data.extension.toLowerCase();
  if (ImageTypes.includes(extension)) {
    return props.data.url || '';
  }
  if (!Object.keys(FileIcon).includes(extension)) {
    return FileIcon.other;
  }
  return FileIcon[extension];
});
</script>

<template>
  <img v-if="isImage" v-bind="bindAttrs" :src="props.data.thumbnailUrl" onerror="javascript:this.src='/logo.svg'" />
  <SvgIcon v-else :local-icon="getFileImg" v-bind="bindAttrs"></SvgIcon>
</template>

<style scoped></style>
