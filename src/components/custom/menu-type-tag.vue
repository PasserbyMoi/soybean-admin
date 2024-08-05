<script lang="ts" setup>
defineOptions({ name: 'MenuTypeTag' });

interface Props {
  value: number;
}

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <NTag v-if="value === 1" type="primary" :bordered="false">目录</NTag>
  <NTag v-if="value === 2" type="success" :bordered="false">菜单</NTag>
  <NTag v-if="value === 3" type="default" :bordered="false">按钮</NTag>
</template>

<style scoped></style>
