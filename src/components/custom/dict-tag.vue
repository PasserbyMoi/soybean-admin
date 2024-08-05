<script lang="ts" setup>
import tinycolor from 'tinycolor2';

defineOptions({ name: 'DictTag' });

interface Props {
  text: string | number;
  color: string;
}

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <NTag
    :color="{
      color: tinycolor(color).setAlpha(0.08).toString(),
      textColor: tinycolor(color).lighten(16).toString()
    }"
    :bordered="false"
  >
    {{ text }}
  </NTag>
</template>

<style scoped></style>
