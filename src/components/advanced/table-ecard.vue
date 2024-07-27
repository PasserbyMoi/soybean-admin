<script setup lang="tsx">
import type { DataTableInst } from 'naive-ui';
import { utils, writeFile } from 'xlsx';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTabStore } from '@/store/modules/tab';
import { useContiNewTable, useTableOperate } from '@/hooks/common/table';
import { enableStatusRecord, tableIndexColumns, tableSelectionColumns, userGenderRecord } from '@/constants/business';
import BButtons from './b-buttons.vue';

const appStore = useAppStore();
const tabStore = useTabStore();

defineOptions({
  name: 'TableCard'
});

interface Props {
  rowKey?: string;
  title?: string;
  showTotal?: boolean;
  showSelection?: boolean;
  showIndex?: boolean;
  enabledAdd?: boolean;
  enabledEdit?: boolean;
  enabledRemove?: boolean;
  enabledExport?: boolean;
  otherOperates?: App.Table.TableButton[];
  apiFn: NaiveUI.TableApiFn;
  apiParams: Api.Common.PaginatingSearchParams | any;
  columns: NaiveUI.TableColumn<any>[];
}
const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  title: undefined,
  showTotal: true,
  showSelection: true,
  showIndex: true,
  enabledAdd: true,
  enabledEdit: true,
  enabledRemove: true,
  enabledExport: true,
  otherOperates: undefined
});

interface Emits {
  (e: 'delete', id: string | number): void;
  (e: 'batchDelete', ids: string[] | number[]): void;
}

const emit = defineEmits<Emits>();

const tableRef = ref<DataTableInst | null>(null);
const tabTitle = props.title ?? tabStore.getActiveTab().label ?? tabStore.getActiveTab().newLabel;

function columnsTransformer(): NaiveUI.TableColumn<any>[] {
  let tableColumns: NaiveUI.TableColumn<any>[] = [];
  if (props.showSelection) {
    tableColumns.push(tableSelectionColumns);
  }
  if (props.showIndex) {
    tableColumns.push(tableIndexColumns);
  }
  tableColumns = tableColumns.concat(props.columns);

  tableColumns.push({
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 180,
    resizable: true,
    fixed: 'right',
    render: row => {
      return (
        <BButtons
          rowId={row.id}
          edit={props.enabledEdit}
          remove={props.enabledRemove}
          buttons={props.otherOperates}
          onEdit={edit}
          onRemove={handleDelete}
        ></BButtons>
      );
    }
  });
  return tableColumns;
}

const { columns, columnChecks, data, getData, getDataByPage, loading, pagination, searchParams, resetSearchParams } =
  useContiNewTable({
    apiFn: props.apiFn,
    showTotal: props.showTotal,
    apiParams: props.apiParams,
    columns: columnsTransformer
  });

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

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

function edit(id: number | string) {
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
 *
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
  const { key } = col;
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
    <NCard :title="tabTitle" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :has-add="enabledAdd"
          :has-delete="enabledRemove"
          :disabled-add="checkedRowKeys.length === 0"
          :disabled-delete="checkedRowKeys.length === 0"
          :disabled-export="data.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        />
      </template>
      <NDataTable
        ref="tableRef"
        v-model:checked-row-keys="checkedRowKeys"
        :row-key="row => row[rowKey]"
        :data="data"
        :columns="columns"
        :loading="loading"
        :size="appStore.tableSize"
        :striped="appStore.isStriped"
        :pagination="pagination"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        remote
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
