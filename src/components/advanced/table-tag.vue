<script setup lang="tsx">
import tinycolor from 'tinycolor2';

defineOptions({
  name: 'TableTag',
  inheritAttrs: false
});

interface Props {
  value: string | number;
  options?: Array<CommonType.EOption>;
}
defineProps<Props>();
</script>

<template>
  <template v-for="option in options" :key="option.value">
    <NTag
      v-if="value == option.value"
      v-bind="$attrs"
      :bordered="false"
      :color="{
        color: tinycolor(option.extend).setAlpha(0.08).toString(),
        textColor: tinycolor(option.extend).lighten(16).toString()
      }"
      class="justify-center"
    >
      {{ option.label }}
    </NTag>
  </template>
</template>

<style scoped></style>
