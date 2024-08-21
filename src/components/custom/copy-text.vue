<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { isBoolean } from 'lodash-es';
import { $t } from '@/locales';

const { copy, isSupported } = useClipboard();

const props = defineProps<{
  maxLength?: string;
  defaultText?: string;
  showText?: boolean | string;
}>();
const modelValue = defineModel<string | number>('value');

async function handleCopy() {
  if (!isSupported) {
    window.$message?.error($t('common.copyNotSupported'));
    return;
  }
  await copy(modelValue.value ? `${modelValue.value}` : (props.defaultText ?? ''));
  window.$message?.success($t('common.copySuccess'));
}
</script>

<template>
  <div v-if="modelValue" class="inline-flex items-center gap-0.5em">
    <NEllipsis v-if="showText" :style="{ 'max-width': props.maxLength || '12em' }">
      {{ isBoolean(showText) ? (modelValue ?? defaultText) : showText }}
    </NEllipsis>
    <NTooltip trigger="hover">
      <template #trigger>
        <span class="cursor-pointer">
          <icon-mdi:content-copy class="text-icon text-size-1rem color-gray" @click="handleCopy" />
        </span>
      </template>
      {{ $t('common.copy') }}
    </NTooltip>
  </div>
</template>
