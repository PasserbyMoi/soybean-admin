import type { ToolbarNames } from 'md-editor-v3';
import { useThemeStore } from '@/store/modules/theme';
import { useAppStore } from '@/store/modules/app';

export function useMdEditor() {
  const appStore = useAppStore();
  const themeStore = useThemeStore();
  const mdEditorRef = ref();
  const previewTheme = ref('github');
  const toolbarsExclude: ToolbarNames[] = ['mermaid', 'katex', 'github', 'htmlPreview', 'catalog'];

  const theme = computed(() => {
    return themeStore.darkMode ? 'dark' : 'light';
  });
  const language = computed(() => {
    return appStore.locale;
  });

  return {
    mdEditorRef,
    theme,
    language,
    previewTheme,
    toolbarsExclude
  };
}
