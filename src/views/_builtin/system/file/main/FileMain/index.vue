<script setup lang="ts">
import { api as viewerApi } from 'v-viewer';
import { type FileItem, type FileQuery, deleteFile, listFile, uploadFile } from '@/apis';
import { ImageTypes } from '@/constants/file';
import { downloadByUrl } from '@/utils/downloadFile';
import {
  openFileDetailModal,
  openFileRenameModal,
  previewFileAudioModal,
  previewFileVideoModal
} from '../../components/index';
import FileGrid from './FileGrid.vue';
import useFileManage from './useFileManage';
import 'viewerjs/dist/viewer.css';

const FileList = defineAsyncComponent(() => import('./FileList.vue'));
const route = useRoute();
const { mode, selectedFileIds, toggleMode, addSelectedFileItem } = useFileManage();

const queryForm = reactive<FileQuery>({
  name: undefined,
  type: route.query.type?.toString() !== '0' ? route.query.type?.toString() : undefined,
  sort: ['updateTime,desc']
});
const paginationOption = reactive({
  defaultPageSize: 30,
  defaultSizeOptions: [30, 40, 50, 100, 120]
});
const isBatchMode = ref(false);
const {
  tableData: fileList,
  loading,
  pagination,
  search
} = useTable(page => listFile({ ...queryForm, ...page }), { immediate: false, paginationOption });

// 点击文件
const handleClickFile = (item: FileItem) => {
  if (ImageTypes.includes(item.extension)) {
    if (item.url) {
      const imgList: string[] = fileList.value.filter(i => ImageTypes.includes(i.extension)).map(a => a.url || '');
      const index = imgList.findIndex(i => i === item.url);
      if (imgList.length) {
        viewerApi({
          options: {
            initialViewIndex: index
          },
          images: imgList
        });
      }
    }
  }
  if (item.extension === 'mp4') {
    previewFileVideoModal(item);
  }
  if (item.extension === 'mp3') {
    previewFileAudioModal(item);
  }
};

// 右键菜单
const handleRightMenuClick = async (modeAction: string, fileInfo: FileItem) => {
  if (modeAction === 'delete') {
    window.$dialog?.warning({
      title: '提示',
      content: `是否确定删除文件 [${fileInfo.name}]？`,
      onPositiveClick: async () => {
        await deleteFile(fileInfo.id);
        window.$message?.success('删除成功');
        search();
      }
    });
  } else if (modeAction === 'rename') {
    openFileRenameModal(fileInfo, search);
  } else if (modeAction === 'detail') {
    openFileDetailModal(fileInfo);
  } else if (modeAction === 'download') {
    const res = await downloadByUrl({
      url: fileInfo.url,
      target: '_self',
      fileName: `${fileInfo.name}.${fileInfo.extension}`
    });
    res ? window.$message?.success('下载成功') : window.$message?.error('下载失败');
    search();
  }
};

// 勾选文件
const handleSelectFile = (item: FileItem) => {
  addSelectedFileItem(item);
};

// 批量删除
const handleMulDelete = () => {
  window.$dialog?.warning({
    title: '提示',
    content: `是否确定删除所选的${selectedFileIds.value.length}个文件？`,
    onPositiveClick: async () => {
      await deleteFile(selectedFileIds.value);
      window.$message?.success('删除成功');
      search();
    }
  });
};

// 上传
const handleUpload = (options: RequestOption) => {
  const controller = new AbortController();
  (async function requestWrap() {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;
    onProgress(20);
    const formData = new FormData();
    formData.append(name as string, fileItem.file as Blob);
    try {
      const res = await uploadFile(formData);
      window.$message?.success('上传成功');
      onSuccess(res);
      search();
    } catch (error) {
      onError(error);
    }
  })();
  return {
    abort() {
      controller.abort();
    }
  };
};

onBeforeRouteUpdate(to => {
  if (!to.query.type) return;
  if (to.query.type === '0') {
    queryForm.type = undefined;
  } else {
    queryForm.type = to.query.type?.toString();
  }

  search();
});

onMounted(() => {
  search();
});
</script>

<template>
  <div class="file-main">
    <NRow justify="space-between" class="file-main__search">
      <!-- 左侧区域 -->
      <NSpace wrap>
        <NDropdown>
          <NUpload :show-file-list="false" :custom-request="handleUpload">
            <template #upload-button>
              <NButton type="primary" shape="round">
                <template #icon>
                  <icon-upload />
                </template>
                <template #default>上传</template>
              </NButton>
            </template>
          </NUpload>
        </NDropdown>

        <NInputGroup>
          <NInput
            v-model="queryForm.name"
            placeholder="请输入文件名"
            allow-clear
            style="width: 200px"
            @change="search"
          />
          <NButton type="primary" @click="search">
            <template #icon>
              <icon-search />
            </template>
            <template #default>查询</template>
          </NButton>
        </NInputGroup>
      </NSpace>

      <!-- 右侧区域 -->
      <NSpace wrap>
        <NButton
          v-if="isBatchMode"
          :disabled="!selectedFileIds.length"
          type="primary"
          status="danger"
          @click="handleMulDelete"
        >
          <template #icon>
            <icon-delete />
          </template>
        </NButton>
        <NButton type="primary" @click="isBatchMode = !isBatchMode">
          <template #icon>
            <icon-select-all />
          </template>
          <template #default>{{ isBatchMode ? '取消批量' : '批量操作' }}</template>
        </NButton>
        <NButtonGroup>
          <NTooltip content="视图">
            <NButton class="gi_hover_btn-border" @click="toggleMode">
              <template #icon>
                <icon-list v-if="mode === 'grid'" />
                <icon-apps v-else />
              </template>
            </NButton>
          </NTooltip>
        </NButtonGroup>
      </NSpace>
    </NRow>

    <!-- 文件列表-宫格模式 -->
    <NSpin id="fileMain" class="file-main__list" :loading="loading">
      <FileGrid
        v-show="fileList.length && mode === 'grid'"
        :data="fileList"
        :is-batch-mode="isBatchMode"
        :selected-file-ids="selectedFileIds"
        @click="handleClickFile"
        @select="handleSelectFile"
        @right-menu-click="handleRightMenuClick"
      ></FileGrid>

      <!-- 文件列表-列表模式 -->
      <FileList
        v-show="fileList.length && mode === 'list'"
        :data="fileList"
        :is-batch-mode="isBatchMode"
        :selected-file-ids="selectedFileIds"
        @click="handleClickFile"
        @select="handleSelectFile"
        @right-menu-click="handleRightMenuClick"
      ></FileList>

      <NEmpty v-if="!fileList.length" />
    </NSpin>
    <div class="pagination">
      <NPagination v-bind="pagination" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-main {
  height: 100%;
  background: var(--color-bg-1);
  // border-radius: $radius-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__search {
    border-bottom: 1px dashed var(--color-border-3);
    // margin: 16px $padding 0;
  }

  &__list {
    flex: 1;
    // padding: 0 $padding $padding;
    box-sizing: border-box;
    // overflow: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .pagination {
    padding: 0 var(--padding) var(--padding);

    :deep(.arco-pagination) {
      justify-content: end;
    }
  }
}
</style>
