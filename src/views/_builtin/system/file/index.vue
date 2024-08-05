<script setup lang="ts">
import FileAside from './main/FileAside.vue';
import FileMain from './main/FileMain/index.vue';

defineOptions({ name: 'SystemFile' });
</script>

<template>
  <NRow align="stretch" :gutter="14" class="file-manage">
    <NCol :xs="0" :sm="8" :md="7" :lg="6" :xl="5" :xxl="4" flex="220px" class="ov-hidden h-full">
      <FileAside></FileAside>
    </NCol>
    <NCol :xs="24" :sm="16" :md="17" :lg="18" :xl="19" :xxl="20" flex="1" class="ov-hidden h-full">
      <FileMain></FileMain>
    </NCol>
  </NRow>
</template>

<style lang="scss" scoped>
.file-manage {
  flex: 1;
  // padding: $margin;
  overflow: hidden;
}
</style>
