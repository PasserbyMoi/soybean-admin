<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { $t } from '@/locales';

const { copy, isSupported } = useClipboard();

const props = defineProps<{
  maxLength?: string;
}>();
const modelValue = defineModel<string>('value');

async function handleCopy() {
  if (!isSupported) {
    window.$message?.error($t('common.copyNotSupported'));
    return;
  }
  await copy(modelValue.value ?? '');
  window.$message?.success($t('common.copySuccess'));
}
</script>

<template>
  <div v-if="modelValue" class="inline-flex items-center gap-0.5em">
    <NEllipsis :style="{ 'max-width': props.maxLength || '12em' }">
      {{ modelValue }}
    </NEllipsis>
    <NTooltip trigger="hover">
      <template #trigger>
        <span class="cursor-pointer">
          <icon-icon-park-outline:copy class="text-icon" @click="handleCopy" />
        </span>
      </template>
      {{ $t('common.copy') }}
    </NTooltip>
  </div>
</template>
