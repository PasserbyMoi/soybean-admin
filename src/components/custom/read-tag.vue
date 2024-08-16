<script lang="ts" setup>
defineOptions({ name: 'ReadTag' });

interface Props {
  value?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: false
});
</script>

<template>
  <NTag v-if="props.value" type="success" :bordered="false">
    <template #default>{{ $t('common.read.read') }}</template>
  </NTag>
  <NTag v-if="!props.value" type="error" :bordered="false">
    <template #default>{{ $t('common.read.unread') }}</template>
  </NTag>
</template>

<style scoped></style>
