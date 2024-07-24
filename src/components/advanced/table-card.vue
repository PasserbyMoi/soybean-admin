<script setup lang="tsx">
import type {DataTableInst} from 'naive-ui';
import {NButton, NPopconfirm} from 'naive-ui';
import {utils, writeFile} from 'xlsx';
import {$t} from '@/locales';
import {useAppStore} from '@/store/modules/app';
import {useTable, useTableOperate} from '@/hooks/common/table';
import {enableStatusRecord, userGenderRecord} from '@/constants/business';

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
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
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
  onDeleted
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  emit('batchDelete', checkedRowKeys.value);
  await onBatchDeleted();
}

function handleDelete(id: string | number) {
  emit('delete', id);
  onDeleted();
}

function handleExport() {
  // tableRef.value?.downloadCsv({ fileName: props.title, keepOriginalData: false });
  exportExcel();
}

function edit(id: number) {
  handleEdit(id);
}

function exportExcel() {
  const exportColumns = columns.value.slice(2);
  const excelList = data.value.map(item => exportColumns.map(col => getTableValue(col, item)));
  const titleList = exportColumns.map(col => (isTableColumnHasTitle(col) && col.title) || null);
  excelList.unshift(titleList);
  const workBook = utils.book_new();
  const workSheet = utils.aoa_to_sheet(excelList);
  workSheet['!cols'] = exportColumns.map(item => ({
    width: Math.round(Number(item.width) / 10 || 20)
  }));
  utils.book_append_sheet(workBook, workSheet, props.title);
  writeFile(workBook, `${props.title}.xlsx`);
}

/**
 * convert enum data, value to label
 * @param col columns
 * @param item Item
 */
function getTableValue(
  col: NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<any>>,
  item: NaiveUI.TableDataWithIndex<any>
) {
  if (!isTableColumnHasKey(col)) {
    return null;
  }
  const {key} = col;
  console.log(`1-------------${JSON.stringify(col)}`);
  console.log(`2-------------${JSON.stringify(item)}`);
  if (key === 'operate') {
    return null;
  } else if (key === 'userRoles') {
    return item.userRoles.map(role => role).join(',');
  } else if (key === 'status') {
    return (item.status && $t(enableStatusRecord[item.status])) || null;
  } else if (key === 'userGender') {
    return (item.userGender && $t(userGenderRecord[item.userGender])) || null;
  }
  return item[key];
}

function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

function isTableColumnHasTitle<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> & {
  title: string;
} {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).title);
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
