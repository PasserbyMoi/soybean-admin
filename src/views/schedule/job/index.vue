<script setup lang="tsx">
import { useTabStore } from '@/store/modules/tab';
const useTab = useTabStore();

onMounted(() => {
  window.open('http://localhost:8001/snail-job/#/job/task', '_blank');
  useTab.removeActiveTab();
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
