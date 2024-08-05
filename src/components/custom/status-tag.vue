<script lang="ts" setup>
defineOptions({ name: 'StatusTag' });

interface Props {
  value?: CommonType.EnableStatus | boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: false
});
</script>

<template>
  <NTag v-if="props.value === 1 || props.value == true" type="primary" :bordered="false">
    <template #default>{{ $t('common.status.succeed') }}</template>
  </NTag>
  <NTag v-else-if="props.value === 2 || props.value == false" type="error" :bordered="false">
    <template #default>{{ $t('common.status.failed') }}</template>
  </NTag>
  <NTag v-else type="default" :bordered="false">
    <template #default>{{ $t('common.unkonw') }}</template>
  </NTag>
</template>

<style scoped></style>
