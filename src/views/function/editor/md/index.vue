<script setup lang="ts">
import { ref } from 'vue';

const text = ref('# Hello Editor ![图片描述](https://via.placeholder.com/350x150)');
</script>

<template>
  <NCard title="MarkDown编辑器">
    <NSpace vertical :size="12">
      <NAlert title="基于 md-editor-v3 封装" type="success" />
      <MarkDownEditor v-model="text" />
    </NSpace>
  </NCard>
</template>

<style scoped></style>
