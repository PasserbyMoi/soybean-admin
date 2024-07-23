<script setup lang="ts">
import {onMounted, ref} from 'vue';
import WangEditor from 'wangeditor';
import RichTextEditor from '../module/rich-text-editor.vue';

const editor = ref<WangEditor>();
const domRef = ref<HTMLElement>();

const text = ref('');
const active = ref(false);

function renderWangEditor() {
  editor.value = new WangEditor(domRef.value);
  setEditorConfig();
  editor.value.create();
}

function setEditorConfig() {
  if (editor.value?.config?.zIndex) {
    editor.value.config.zIndex = 10;
  }
}

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    text.value = '<p>模拟 Ajax 异步设置内容</p>';
  }, 1500);
});


onMounted(() => {
  renderWangEditor();
});
</script>

<template>
  <div class="h-full">
    <NCard title="富文本插件" :bordered="false" class="card-wrapper">
      <div ref="domRef" class="bg-white dark:bg-dark"></div>
      <template #footer>
        <GithubLink link="https://github.com/wangeditor-team/wangEditor"/>
      </template>
    </NCard>
  </div>
  <div class="h-full">
    <NCard title="富文本插件" :bordered="false" class="card-wrapper">
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
  </div>
</template>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: #999 !important;
}

:deep(.w-e-text-container) {
  background: inherit;
  border-color: #999 !important;
}
</style>
