<script setup lang="ts">
import MarkDownEditor from '../module/mark-down-editor.vue';

const text = ref('# Hello Editor ![图片描述](https://via.placeholder.com/350x150)');
</script>

<template>
  <div class="h-full">
    <NCard title="MarkDown编辑器 基于 md-editor-v3 封装" :bordered="false" class="card-wrapper">
      <div ref="domRef"></div>
      <template #footer>
        <NAlert title="基于 md-editor-v3 封装" type="success" />
        <MarkDownEditor v-model="text" />
      </template>
    </NCard>
  </div>
</template>

<style scoped></style>
