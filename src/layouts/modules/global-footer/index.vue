<script setup lang="ts">
import { useConfigStore } from '@/store/modules/config';

defineOptions({
  name: 'GlobalFooter'
});

const configStore = useConfigStore();
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <a href="https://github.com/soybeanjs/soybean-admin/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
      {{ configStore.getCopyright() }} • {{ configStore.getBeian() }}
    </a>
  </DarkModeContainer>
</template>

<style scoped></style>
