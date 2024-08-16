<script setup lang="tsx">
import type { TableColumn } from 'naive-ui/es/data-table/src/interface';
import { h, ref } from 'vue';
import { type MessageQuery, type MessageResp, deleteMessage, listMessage, readMessage } from '@/apis';
import { $t } from '@/locales';
import ReadTag from '@/components/custom/read-tag.vue';
import { useDict } from '@/hooks/business/dict';
import TableTag from '@/components/advanced/table-tag.vue';

defineOptions({ name: 'SystemMessage' });

const apiParams: Api.Common.EPaginatingSearchParams<MessageQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  title: null,
  isRead: null
};
const columns = ref<TableColumn<any>[]>([
  { title: '标题', key: 'title', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '内容', key: 'content', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'isRead',
    align: 'center',
    resizable: true,
    render: row => {
      return h(ReadTag, { value: row.isRead });
    }
  },
  { title: '时间', key: 'createTime', align: 'center', resizable: true },
  {
    title: '类型',
    key: 'type',
    align: 'center',
    resizable: true,
    render: row => {
      return h(TableTag, { value: `${row.type}`, options: message_type.value });
    }
  }
]);

const operations: App.Table.Operation<MessageResp>[] = [
  {
    label: '已读',
    type: 'success',
    disabled: row => row.isRead,
    yesHandle(row, _index) {
      if (row.id) readHandle(row.id);
    }
  },
  {
    label: '删除',
    type: 'error',
    confirm: true,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];
const { message_type } = useDict('message_type');

const tableRef = ref();
const checkedRowKeys = computed(() => {
  if (tableRef?.value?.checkedRowKeys) {
    return tableRef.value.checkedRowKeys;
  }
  return [];
});

function readHandle(id: string | string[]) {
  if (!id || id.length <= 0) {
    window.$message?.warning('请先选择要标记为已读的数据');
    return;
  }
  readMessage(id).then(() => {
    window.$message?.info($t('common.operateSuccess'));
    submited();
  });
}

function deleteHandle(id: string | string[]) {
  if (!id || id.length <= 0) {
    window.$message?.warning('请先选择要删除的数据');
    return;
  }
  deleteMessage(id).then(() => {
    window.$message?.info($t('common.deleteSuccess'));
    submited();
  });
}

function submited() {
  tableRef.value.getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="id"
      :api-fn="listMessage"
      :api-params="apiParams"
      :columns="columns"
      :columns-operations="operations"
      :header-operations="['export', 'refresh', 'height', 'columnSetting']"
      @delete="deleteHandle"
    >
      <template #operations>
        <NPopconfirm @positive-click="readHandle(checkedRowKeys)">
          <template #trigger>
            <NButton size="small" ghost type="primary" :disabled="checkedRowKeys.length <= 0">
              <template #icon>
                <icon-material-symbols:bookmark-check-outline class="text-icon" />
              </template>
              {{ $t('common.read.read') }}
            </NButton>
          </template>
          {{ $t('common.confirmOperations', { name: '标记已读' }) }}
        </NPopconfirm>
        <NPopconfirm @positive-click="deleteHandle(checkedRowKeys)">
          <template #trigger>
            <NButton size="small" ghost type="error" :disabled="checkedRowKeys.length <= 0">
              <template #icon>
                <icon-material-symbols:auto-delete-outline class="text-icon" />
              </template>
              {{ $t('common.delete') }}
            </NButton>
          </template>
          {{ $t('common.confirmOperations', { name: '删除' }) }}
        </NPopconfirm>
      </template>
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="标题" path="title">
          <NInput v-model:value="searchParams.title" placeholder="请输入标题" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="状态" path="isRead">
          <NSelect
            v-model:value="searchParams.isRead"
            :options="[
              { label: '已读', value: true },
              { label: '未读', value: false }
            ]"
            placeholder="请选择状态"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
  </div>
</template>

<style scoped></style>
