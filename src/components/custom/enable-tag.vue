<script lang="ts" setup>
defineOptions({ name: 'EnableTag' });

interface Props {
  value?: CommonType.EnableStatus | boolean;
  showText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: false,
  showText: false
});
</script>

<template>
  <NTag v-if="props.value === 1 || props.value == true" type="primary" :bordered="false">
    <template #icon><icon-icon-park-solid:check-one class="w-16px" /></template>
    <template v-if="showText" #default>{{ $t('common.enable.enabled') }}</template>
  </NTag>
  <NTag v-else-if="props.value === 2 || props.value == false" type="error" :bordered="false">
    <template #icon><icon-icon-park-solid:reduce-one class="w-16px" /></template>
    <template v-if="showText" #default>{{ $t('common.enable.disabled') }}</template>
  </NTag>
  <NTag v-else type="default" :bordered="false">
    <template #icon><icon-icon-park-solid:help class="w-16px" /></template>
    <template v-if="showText" #default>{{ $t('common.unkonw') }}</template>
  </NTag>
</template>

<style scoped></style>
