<script setup lang="tsx">
defineOptions({
  name: 'TableTag',
  inheritAttrs: false
});

interface Props {
  value: string | number;
  options?: Array<any>;
}
defineProps<Props>();
</script>

<template>
  <template v-for="option in options" :key="option.value">
    <NTag
      v-if="value == option.value"
      v-bind="$attrs"
      :bordered="false"
      class="justify-center"
      :type="
        option.type ??
        (option.value == 0 ? 'warning' : option.value == 1 ? 'primary' : option.value == 2 ? 'error' : 'info')
      "
    >
      {{ option.label }}
    </NTag>
  </template>
</template>

<style scoped></style>
