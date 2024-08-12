<script lang="ts" setup>
import CodeMirror from 'vue-codemirror6';
import { javascript } from '@codemirror/lang-javascript';
import { vue } from '@codemirror/lang-vue';
import { tomorrow } from 'thememirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'CodeView'
});

interface Props {
  type?: 'javascript' | 'vue';
  codeJson: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'javascript',
  codeJson: ''
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const defaultConfig = {
  tabSize: 2,
  basic: true,
  dark: true,
  readonly: true
};

const appThemeStore = useThemeStore();
const config = defaultConfig;
const codeValue = computed(() => props.codeJson);

const extensions = computed(() => {
  const arr = [appThemeStore.darkMode ? oneDark : tomorrow];
  if (props.type === 'javascript') {
    arr.push(javascript());
  }
  if (props.type === 'vue') {
    arr.push(vue());
  }
  return arr;
});

// 打开
const open = () => {
  visible.value = true;
};

watch(visible, () => {});

defineExpose({ open });
</script>

<template>
  <CodeMirror
    :model-value="codeValue"
    :tab-size="config.tabSize"
    :basic="config.basic"
    :dark="config.dark"
    :readonly="config.readonly"
    :extensions="extensions"
  />
</template>

<style lang="scss" scoped>
:deep(.ͼ1 .cm-scroller) {
  font-family:
    source-code-pro,
    Menlo,
    Monaco,
    Consolas,
    Courier New,
    monospace;
}
</style>
