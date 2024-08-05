<script setup lang="ts">
import type { FileItem } from '@/apis';

interface Props {
  data?: FileItem;
  shadow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shadow: true
});

const emit = defineEmits<{
  (e: 'click', mode: string): void;
}>();

const onClickItem = (mode: string) => {
  emit('click', mode);
};
</script>

<template>
  <NList :class="{ shadow: props.shadow }">
    <NListItem label="重命名" @click="onClickItem('rename')"></NListItem>
    <NListItem label="详情" @click="onClickItem('detail')"></NListItem>
    <NListItem label="下载" @click="onClickItem('download')"></NListItem>
    <NListItem label="删除" @click="onClickItem('delete')"></NListItem>
  </NList>
</template>

<style lang="scss" scoped>
.shadow {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.12),
    0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
  background: var(--color-bg-popup);
}
</style>
