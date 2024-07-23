<script setup lang="ts">
import { onMounted, ref } from 'vue';

const text = ref('');
// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    text.value = '<p>模拟 Ajax 异步设置内容</p>';
  }, 1500);
});

const active = ref(false);
</script>

<template>
  <NCard title="富文本编辑器">
    <NSpace vertical :size="12">
      <NAlert title="基于 Quill 封装" type="success" />
      <NSwitch v-model:value="active">
        <template #checked>禁用</template>
        <template #unchecked>启用</template>
      </NSwitch>
      <NSpace :size="12">
        <div class="h-300px">
          <RichTextEditor v-model="text" :disabled="active" />
        </div>
        <div>
          <NH2>v-html 预览</NH2>
          <div v-html="text" />
        </div>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<style scoped></style>
