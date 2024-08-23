<script setup lang="ts">
import { api as viewerApi } from 'v-viewer';
import type { DataTableInst, DropdownOption, UploadCustomRequestOptions } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import type { FileItem, FileQuery } from '@/apis';
import { deleteFile, listFile, uploadFile } from '@/apis';
import { downloadByUrl } from '@/utils/download';
import { ImageTypes, MusicTypes, VideoTypes } from '@/constants/file';
import { useAppStore } from '@/store/modules/app';
import { formatFileSize } from '@/utils';
import { $t } from '@/locales';
import { useCommonTable } from '@/hooks/common/table';
import CopyText from '@/components/custom/copy-text.vue';
import ContextMenu from '@/components/advanced/context-menu.vue';
import { useSvgIcon } from '@/hooks/common/icon';
import FilePreview from '@/components/advanced/file-preview.vue';
import { useFileManage } from '../../config/modules/useFileManage';
import FileImage from './content/file-image.vue';
import FileRenameModal from './content/file-rename-modal.vue';
import FileDetailModal from './content/file-detail-modal.vue';
// import FilePreviewModal from './content/file-preview-modal.vue';
import 'viewerjs/dist/viewer.css';

defineOptions({ name: 'FileContent' });

const type = defineModel<string>('type', {
  default: () => ''
});

const appStore = useAppStore();
const tableRef = ref<DataTableInst>();
const isBatchMode = ref(false);
const selectFileItem = ref<FileItem>();

const menuRef = ref();
const previewRef = ref();
const renameRef = ref<boolean>();
const renameVisible = ref<boolean>();
const detailRef = ref<boolean>();
const detailVisible = ref<boolean>();

const { mode, isChecked, selectedFileIds, toggleMode, addSelectedFileItem } = useFileManage();

const apiMode = ref<Api.Common.EPaginatingSearchParams<FileQuery>>({
  page: 1,
  size: 50,
  sort: ['updateTime, desc'],
  name: null,
  type: type.value
});

const { SvgIconVNode } = useSvgIcon();
const menuOptions = ref<DropdownOption[]>([
  {
    label: '重命名',
    key: 'rename',
    icon: SvgIconVNode({ localIcon: 'edit', fontSize: 14 })
  },
  {
    label: '详情',
    key: 'detail',
    icon: SvgIconVNode({ localIcon: 'eye', fontSize: 14 })
  },
  {
    label: '下载',
    key: 'download',
    icon: SvgIconVNode({ localIcon: 'download', fontSize: 14 })
  },
  {
    label: '删除',
    key: 'delete',
    icon: SvgIconVNode({ localIcon: 'delete', fontSize: 14 })
  }
]);

const { columns, columnChecks, data, getData, loading, pagination, searchParams } = useCommonTable({
  apiFn: listFile,
  showTotal: true,
  apiParams: apiMode.value,
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 40
    },
    {
      title: '名称',
      key: 'name',
      align: 'left',
      titleAlign: 'center',
      render(row: FileItem) {
        return h(
          NSpace,
          {
            wrap: false,
            class: 'items-center',
            onClick: () => {
              handleClickFile(row);
            }
          },
          {
            default: () => [
              h(FileImage, { data: row, class: 'h-32px w-32px cursor-pointer' }),
              h(CopyText, { value: `${row.name}.${row.extension}`, showText: true, maxLength: '500px' })
            ]
          }
        );
      }
    },
    {
      title: '大小',
      key: 'size',
      align: 'right',
      titleAlign: 'center',
      width: 100,
      render: (row: FileItem) => {
        return formatFileSize(row.size);
      }
    },
    {
      title: '存储名称',
      key: 'storageName',
      align: 'center',
      width: 200,
      ellipsis: { tooltip: true }
    },
    {
      title: '修改时间',
      key: 'updateTime',
      align: 'center',
      width: 180,
      ellipsis: { tooltip: true }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (row: any) => {
        return h(
          NButton,
          {
            text: true,
            data: row,
            onClick: (e: MouseEvent) => {
              handleRightClickFile(row, e);
            }
          },
          { default: () => '...' }
        );
      }
    }
  ]
});

// 右键点击，弹出菜单
const handleRightClickFile = (item: FileItem, e: MouseEvent) => {
  menuRef.value.show(e, item);
};

// 右键菜单操作
const handleMenuClick = async (operate: string | number, _option: DropdownOption, fileInfo: FileItem) => {
  if (operate === 'delete') {
    window.$dialog?.warning({
      title: $t('common.warning'),
      content: $t('common.confirmDeleteWhat', { name: fileInfo.name }),
      positiveText: $t('common.confirm'),
      negativeText: $t('common.cancel'),
      maskClosable: false,
      closeOnEsc: true,
      onPositiveClick: async () => {
        const { error } = await deleteFile(fileInfo.id);
        if (!error) {
          window.$message?.success($t('common.deleteSuccess'));
          submited();
        }
      }
    });
  } else if (operate === 'rename') {
    selectFileItem.value = fileInfo;
    renameVisible.value = true;
  } else if (operate === 'detail') {
    selectFileItem.value = fileInfo;
    detailVisible.value = true;
  } else if (operate === 'download') {
    await onDownload(fileInfo);
  }
};

// 点击文件预览
const handleClickFile = (item: FileItem, _e?: MouseEvent) => {
  selectFileItem.value = item;
  // 勾选文件
  if (isBatchMode.value) {
    addSelectedFileItem(item);
    return;
  }
  // 预览文件
  if (import.meta.env.VITE_FILE_PREVIEW_MODE === 'kk') {
    // filePreviewRef.value.show(item);
  } else {
    // previewRef.value.close();
    console.log(JSON.stringify(selectFileItem.value));
    previewRef.value.show(selectFileItem.value);
  }
};

// 上传
const handleUpload = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  window.$loadingBar?.start();
  const controller = new AbortController();
  (async function requestWrap() {
    onProgress({ percent: 20 });
    const formData = new FormData();
    formData.append('file', file.file as File);
    uploadFile(formData)
      .then(_res => {
        onFinish();
        submited();
        window.$loadingBar?.finish();
        window.$message?.success($t('common.uploadSuccess'));
      })
      .catch(_error => {
        onError();
        window.$loadingBar?.finish();
      });
  })();
  return {
    abort() {
      window.$loadingBar?.finish();
      controller.abort();
    }
  };
};

// 下载文件
const onDownload = async (fileInfo: FileItem) => {
  await downloadByUrl({
    url: fileInfo.url,
    target: '_self',
    fileName: `${fileInfo.name}.${fileInfo.extension}`
  }).then(res => {
    if (res) {
      window.$message?.success($t('common.downlondSuccess'));
    }
  });
};

// 批量删除
const handleMulDelete = () => {
  window.$dialog?.warning({
    title: $t('common.warning'),
    content: $t('common.confirmDeletes', { count: selectedFileIds.value.length }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    maskClosable: false,
    onPositiveClick: async () => {
      const { error } = await deleteFile(selectedFileIds.value);
      if (!error) {
        window.$message?.success($t('common.deleteSuccess'));
        submited();
      }
    }
  });
};

function submited() {
  getData();
}

watch(
  isBatchMode,
  newValue => {
    newValue ? (columnChecks.value[0].checked = true) : (columnChecks.value[0].checked = false);
  },
  { immediate: true }
);
watch(type, newValue => {
  searchParams.type = newValue === '0' ? undefined : newValue;
  getData();
});
</script>

<template>
  <NCard size="small" :bordered="false" class="h-full">
    <template #header>
      <NFlex :wrap="false" justify="space-between">
        <NSpace :wrap="false" justify="start">
          <NInputGroup class="max-w-300px">
            <NInput v-model:value="searchParams.name" placeholder="请输入文件名" clearable />
            <NButton type="primary" @click="getData">
              <template #icon>
                <icon-local-search />
              </template>
              {{ $t('common.search') }}
            </NButton>
          </NInputGroup>
          <NUpload :show-file-list="false" :custom-request="handleUpload">
            <NButton type="primary" shape="round">
              <template #icon>
                <icon-local-upload />
              </template>
              {{ $t('common.upload') }}
            </NButton>
          </NUpload>
        </NSpace>
        <NSpace :wrap="false" justify="end">
          <NButton v-if="isBatchMode" :disabled="!selectedFileIds.length" type="error" @click="handleMulDelete">
            <template #icon>
              <icon-local-delete />
            </template>
          </NButton>
          <NButton type="primary" @click="isBatchMode = !isBatchMode">
            <template #icon>
              <icon-local-select-all />
            </template>
            {{ isBatchMode ? $t('common.bulkOperationsCancel') : $t('common.bulkOperations') }}
          </NButton>
          <NButtonGroup>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton class="gi_hover_btn-border" @click="toggleMode">
                  <template #icon>
                    <icon-local-list v-if="mode === 'grid'" />
                    <icon-local-apps v-else />
                  </template>
                </NButton>
              </template>
              {{ $t('common.view.label') }}
            </NTooltip>
          </NButtonGroup>
        </NSpace>
      </NFlex>
      <NDivider dashed class="!mb-0px !mt-10px" />
    </template>
    <NDataTable
      v-show="mode === 'table'"
      ref="tableRef"
      v-model:checked-row-keys="selectedFileIds"
      :row-key="row => row.id"
      :data="data"
      :columns="columns"
      :loading="loading"
      :size="appStore.tableSize"
      :striped="appStore.isStriped"
      :flex-height="!appStore.isMobile"
      :pagination="pagination"
      :scroll-x="1000"
      class="sm:h-full"
      remote
    />
    <div v-show="mode === 'grid'">
      <NGrid cols="3 sm:4 m:6 l:7 xl:9 xxl:10" x-gap="12" y-gap="16" responsive="screen">
        <NGridItem
          v-for="item in data"
          :key="item.id"
          @click="handleClickFile(item, $event)"
          @contextmenu.prevent.stop="handleRightClickFile(item, $event)"
        >
          <NCheckbox
            v-if="isBatchMode"
            :checked="isChecked(item)"
            size="small"
            class="position-absolute z-999 m-6px"
          ></NCheckbox>
          <NCard hoverable :embedded="isBatchMode" :bordered="false" size="small" class="h-120px items-center">
            <FileImage :data="item" class="h-68px w-auto" />
            <template #footer>
              <NEllipsis line-clamp="1" class="font-size-0.8rem">
                {{ item.name + '.' + item.extension }}
              </NEllipsis>
            </template>
          </NCard>
        </NGridItem>
      </NGrid>
    </div>
    <ContextMenu ref="menuRef" :options="menuOptions" class="w-120px" @select="handleMenuClick"></ContextMenu>
    <FileRenameModal
      ref="renameRef"
      v-model:visible="renameVisible"
      v-model:file-item="selectFileItem"
      @submitted="submited"
    />
  </NCard>
  <FileDetailModal ref="detailRef" v-model:visible="detailVisible" v-model:file-item="selectFileItem" />
  <FilePreview ref="previewRef" v-model:files="data" />
  <!-- <FilePreviewModal ref="filePreviewRef" /> -->
</template>

<style scoped></style>
