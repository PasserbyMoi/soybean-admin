<script setup lang="ts">
import { ref } from 'vue';
import type { FileItem } from '@/apis';
import { encodeByBase64 } from '@/utils/encrypt';
import { $t } from '@/locales';

defineOptions({ name: 'FilePreviewModal' });

interface Emits {
  (e: 'download', file: FileItem | undefined): void;
}
const emit = defineEmits<Emits>();

const visible = ref(false);
const title = ref($t('common.previewFile'));
const fileObject = ref<FileItem>();
const isLoading = ref(false);
const error = ref('');
const previewUrl = ref('');

// 显示弹窗
function show(fileItem: FileItem) {
  fileObject.value = fileItem;
  visible.value = true;
  title.value = `${fileItem.name}.${fileItem.extension}`;
  isLoading.value = true;
  error.value = '';

  previewUrl.value = `${import.meta.env.FILE_VIEW_SERVER_URL}/onlinePreview?url=${encodeURIComponent(encodeByBase64(fileItem.url))}`;
}

// 下载文件
const onDownloadFile = () => {
  emit('download', fileObject.value);
};
defineExpose({
  show
});
</script>

<template>
  <div>
    <NModal v-model:visible="visible" :title="title" closable close-on-esc width="90%" draggable>
      <div class="modal-content">
        <div class="modal-header">
          <NButton type="primary" size="small" @click="onDownloadFile">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('common.downlond') }}
          </NButton>
        </div>
        <div class="iframe-container">
          <iframe :src="previewUrl" />
        </div>
      </div>
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.iframe-container {
  overflow: hidden;
  flex: 1;
  height: calc(80vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
