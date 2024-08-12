<script lang="ts" setup>
defineOptions({ name: 'GenderTag' });

interface Props {
  value?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0
});
</script>

<template>
  <NTag v-if="props.value == 1" type="primary" :bordered="false">
    <template #icon><icon-gg:boy class="w-16px" /></template>
    <template #default>{{ $t('common.gender.male') }}</template>
  </NTag>
  <NTag v-else-if="props.value == 2" type="error" :bordered="false">
    <template #icon><icon-gg:girl class="w-16px" /></template>
    <template #default>{{ $t('common.gender.female') }}</template>
  </NTag>
  <NTag v-else type="default" :bordered="false">
    <template #icon><icon-gg:ghost-character class="w-16px" /></template>
    <template #default>{{ $t('common.gender.unknow') }}</template>
  </NTag>
</template>

<style scoped></style>
