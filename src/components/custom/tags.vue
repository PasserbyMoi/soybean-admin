<script lang="ts" setup>
defineOptions({ name: 'Tags' });

interface Props {
  values: string[] | number[];
  type?: import('naive-ui/es/tag/src/Tag').TagProps['type'];
}

withDefaults(defineProps<Props>(), {
  type: 'default'
});
</script>

<template>
  <NTag v-for="value in values" :key="value" :type="type" :bordered="false" size="small" round>
    <template #default>{{ value }}</template>
  </NTag>
</template>

<style scoped></style>
