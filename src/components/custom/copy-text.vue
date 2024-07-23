<script setup lang="ts">
const props = defineProps<{
  maxLength?: string;
}>();
const modelValue = defineModel<string>('value');
</script>

<template>
  <div v-if="modelValue" class="inline-flex items-center gap-0.5em">
    <NEllipsis :style="{ 'max-width': props.maxLength || '12em' }">
      {{ modelValue }}
    </NEllipsis>
    <NTooltip trigger="hover">
      <template #trigger>
        <span v-copy="modelValue" class="cursor-pointer">
          <icon-park-outline-copy />
        </span>
      </template>
      {{ $t('components.copyText.tooltip') }}
    </NTooltip>
  </div>
</template>
