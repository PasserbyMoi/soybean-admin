<script setup lang="ts">
import FileAside from './modules/file-aside.vue';
import FileStatistics from './modules/file-statistics.vue';
import FileContent from './modules/file-content.vue';

defineOptions({ name: 'SystemFile' });

const type = ref<string>();
</script>

<template>
  <div>
    <NFlex :wrap="false" :size="[8, 8]" class="h-full">
      <NFlex vertical :size="[8, 8]" class="w-240px">
        <FileAside v-model:type="type" />
        <FileStatistics />
      </NFlex>
      <FileContent v-model:type="type" />
    </NFlex>
  </div>
</template>

<style scoped></style>
