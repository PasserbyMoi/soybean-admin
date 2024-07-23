<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { MdEditor } from 'md-editor-v3';
import type { ToolbarNames } from 'md-editor-v3';
import { useThemeStore } from '@/store/modules/theme';

// https://imzbf.github.io/md-editor-v3/zh-CN/docs
import 'md-editor-v3/lib/style.css';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const themeStore = useThemeStore();
const data = useVModel(props, 'modelValue', emit);

const theme = computed(() => {
  return themeStore.darkMode ? 'dark' : 'light';
});

const toolbarsExclude: ToolbarNames[] = ['mermaid', 'katex', 'github', 'htmlPreview', 'catalog'];
</script>

<template>
  <MdEditor v-model="data" :theme="theme" :toolbars-exclude="toolbarsExclude" />
</template>

<style scoped></style>
