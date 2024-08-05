<script setup lang="ts">
import type { TableInstance, TableRowSelection } from '@arco-design/web-vue';
import type { FileItem } from '@/apis';
import { formatFileSize } from '@/utils';
import FileImage from './FileImage.vue';
import FileRightMenu from './FileRightMenu.vue';

interface Props {
  data?: FileItem[];
  selectedFileIds?: string[];
  isBatchMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [], // 文件数据
  selectedFileIds: () => [],
  isBatchMode: false // 是否是批量模式
});

const emit = defineEmits<{
  (e: 'click', record: FileItem): void;
  (e: 'select', record: FileItem): void;
  (e: 'right-menu-click', mode: string, item: FileItem): void;
}>();

// 文件名称带后缀
const getFileName = (item: FileItem) => {
  return `${item.name}${item.extension ? `.${item.extension}` : ''}`;
};

const rowSelection: TableRowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true
});

// 多选
const select: TableInstance['onSelect'] = (rowKeys, rowKey, record) => {
  emit('select', record as unknown as FileItem);
};

// 行点击事件
const handleRowClick: TableInstance['onRowClick'] = record => {
  emit('click', record as unknown as FileItem);
};

// 右键菜单点击事件
const handleRightMenuClick = (mode: string, item: FileItem) => {
  emit('right-menu-click', mode, item);
};
</script>

<template>
  <div class="file-list">
    <ATable
      row-key="id"
      :scroll="{ x: '100%', y: '100%', minWidth: 800 }"
      :data="props.data"
      :bordered="false"
      :pagination="false"
      :row-selection="isBatchMode ? rowSelection : undefined"
      :selected-keys="selectedFileIds"
      column-resizable
      @select="select"
      @row-click="handleRowClick"
    >
      <template #columns>
        <ATableColumn title="名称">
          <template #cell="{ record }">
            <ATrigger
              trigger="contextMenu"
              align-point
              animation-name="slide-dynamic-origin"
              auto-fit-transform-origin
              position="bl"
              update-at-scroll
              scroll-to-close
            >
              <section class="file-name">
                <div class="file-image">
                  <FileImage :data="record"></FileImage>
                </div>
                <ATypographyParagraph copyable :copy-text="record.url">
                  <template #copy-tooltip>复制链接</template>
                  {{ getFileName(record) }}
                </ATypographyParagraph>
              </section>
              <template #content>
                <FileRightMenu :data="record" @click="handleRightMenuClick($event, record)"></FileRightMenu>
              </template>
            </ATrigger>
          </template>
        </ATableColumn>
        <ATableColumn title="大小" data-index="size" :width="150">
          <template #cell="{ record }">{{ formatFileSize(record.size) }}</template>
        </ATableColumn>
        <ATableColumn title="存储名称" data-index="storageName" :width="200" />
        <ATableColumn title="修改时间" data-index="updateTime" :width="200" />
        <ATableColumn title="操作" :width="120" align="center">
          <template #cell="{ record }">
            <APopover trigger="click" position="bottom" :content-style="{ padding: 0, 'margin-top': 0 }">
              <AButton type="text" @click.stop><icon-more :size="16" /></AButton>
              <template #content>
                <FileRightMenu :file-info="record" :shadow="false" @click="handleRightMenuClick($event, record)" />
              </template>
            </APopover>
          </template>
        </ATableColumn>
      </template>
    </ATable>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-table-td .arco-table-cell) {
  padding-top: 0;
  padding-bottom: 0;
}
.file-list {
  width: 100%;
  padding-top: 12px;
  overflow: hidden;
  .file-name {
    height: 100%;
    display: flex;
    align-items: center;
    padding-top: 6px;
    padding-bottom: 6px;
    cursor: pointer;
  }
  .file-image {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}
</style>
