<script setup lang="ts">
import type { MenuOption } from 'naive-ui';
import { FileTypeList } from '@/constants/file';

defineOptions({ name: 'FileAside' });

const type = defineModel<string>('type', {
  default: () => '0'
});

// 点击事件
const onClickItem = (key: string, _item: MenuOption) => {
  type.value = key;
};
</script>

<template>
  <NCard title="文件管理" segmented size="small" :bordered="false">
    <NMenu
      v-model:value="type"
      :default-expanded-keys="['list']"
      :options="FileTypeList"
      :indent="16"
      @update:value="onClickItem"
    />
  </NCard>
</template>

<style scoped></style>
