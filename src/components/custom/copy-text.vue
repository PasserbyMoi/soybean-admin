<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { $t } from '@/locales';

const { copy, isSupported } = useClipboard();

const props = defineProps<{
  maxLength?: string;
  defaultText?: string;
  showText?: boolean;
}>();
const modelValue = defineModel<string | number>('value');

async function handleCopy() {
  if (!isSupported) {
    window.$message?.error($t('common.copyNotSupported'));
    return;
  }
  await copy(modelValue.value ? `${modelValue.value}` : '');
  window.$message?.success($t('common.copySuccess'));
}
</script>

<template>
  <div v-if="modelValue" class="inline-flex items-center gap-0.5em">
    <NEllipsis v-if="showText" :style="{ 'max-width': props.maxLength || '12em' }">
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
  <div v-else>{{ defaultText }}</div>
</template>
