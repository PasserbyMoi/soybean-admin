<script setup lang="tsx">
defineOptions({
  name: 'BoolTag'
});

interface Props {
  value?: CommonType.EnableStatus | boolean | 'y' | 'Y' | 'yes' | 'YES' | 'n' | 'N' | 'no' | 'NO';
}

const props = withDefaults(defineProps<Props>(), {
  value: false
});
</script>

<template>
  <NTag
    v-if="
      props.value === 1 ||
      props.value == true ||
      props.value == 'y' ||
      props.value == 'Y' ||
      props.value == 'yes' ||
      props.value == 'YES'
    "
    type="primary"
    :bordered="false"
  >
    <template #default>{{ $t('common.yesOrNo.yes') }}</template>
  </NTag>
  <NTag
    v-else-if="
      props.value === 2 ||
      props.value == false ||
      props.value == 'n' ||
      props.value == 'N' ||
      props.value == 'no' ||
      props.value == 'NO'
    "
    type="error"
    :bordered="false"
  >
    <template #default>{{ $t('common.yesOrNo.no') }}</template>
  </NTag>
  <NTag v-else type="default" :bordered="false">
    <template #default>{{ $t('common.unkonw') }}</template>
  </NTag>
</template>

<style scoped></style>
