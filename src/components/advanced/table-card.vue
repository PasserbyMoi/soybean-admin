<script setup lang="tsx">
import type { DataTableInst } from 'naive-ui';
import { NButton, NPopconfirm } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

defineOptions({
  name: 'TableCard'
});

interface Props {
  title?: string;
  showTotal?: boolean;
  apiFn: NaiveUI.TableApiFn;
  apiParams: Api.SystemManage.CommonSearchParams;
  columns: NaiveUI.TableColumn<any>[];
}
const props = defineProps<Props>();

interface Emits {
  (e: 'delete', id: string | number): void;
  (e: 'batchDelete', ids: string[] | number[]): void;
}
const emit = defineEmits<Emits>();

const tableRef = ref<DataTableInst | null>(null);

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: props.apiFn,
  showTotal: props.showTotal,
  apiParams: props.apiParams,
  columns: () => [
    ...props.columns,
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
      resizable: true,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,
  onExported
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  emit('batchDelete', checkedRowKeys.value);
  onBatchDeleted();
}

function handleDelete(id: string | number) {
  emit('delete', id);
  onDeleted();
}

function handleExport() {
  // emit('export');
  tableRef.value?.downloadCsv({ fileName: props.title, keepOriginalData: false });
  onExported();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch flex-auto gap-16px overflow-hidden lt-sm:overflow-auto">
    <slot name="search" :param="searchParams" :reset="resetSearchParams" :refresh="getDataByPage"></slot>
    <NCard :title="title" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :disabled-export="data.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
          @export="handleExport"
        />
      </template>
      <NDataTable
        ref="tableRef"
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        :size="appStore.tableSize"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :striped="appStore.isStriped"
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
    <slot
      name="drawer"
      :visible="drawerVisible"
      :type="operateType"
      :data="editingData"
      :submitted="getDataByPage"
    ></slot>
  </div>
</template>

<style scoped></style>
<!-- v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" -->
