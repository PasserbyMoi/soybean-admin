<script setup lang="tsx">
import type { DataTableInst } from 'naive-ui';
import { utils, writeFile } from 'xlsx';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTabStore } from '@/store/modules/tab';
import { useContiNewTable, useTableOperate } from '@/hooks/common/table';
import { enableStatusRecord, tableIndexColumns, tableSelectionColumns, userGenderRecord } from '@/constants/business';
import { useNaiveForm } from '@/hooks/common/form';

const appStore = useAppStore();
const tabStore = useTabStore();

defineOptions({
  name: 'ETableCard'
});

interface Props {
  rowKey?: string;
  title?: string;
  showTotal?: boolean;
  showSelection?: boolean;
  showIndex?: boolean;
  apiFn: NaiveUI.TableApiFn;
  apiParams: Api.Common.PaginatingSearchParams | any;
  columns: NaiveUI.TableColumn<any>[];

  itemAlign?: NaiveUI.Align;
  addOperation?: UnionKey.TableOperationState;
  deleteOperation?: UnionKey.TableOperationState;
  exportOperation?: UnionKey.TableOperationState;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  title: undefined,
  showTotal: true,
  showSelection: true,
  showIndex: true,

  itemAlign: 'flex-end',
  addOperation: 'enabled',
  deleteOperation: 'enabled',
  exportOperation: 'enabled',
  loading: false
});

interface Emits {
  (e: 'delete', id: string | number): void;
  (e: 'batchDelete', ids: string[] | number[]): void;
}

const emit = defineEmits<Emits>();

const tableRef = ref<DataTableInst | null>(null);
const { formRef, validate, restoreValidation } = useNaiveForm();
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

  // tableColumns.push({
  //   key: 'operate',
  //   title: $t('common.operate'),
  //   align: 'center',
  //   width: 180,
  //   resizable: true,
  //   fixed: 'right',
  //   render: row => {
  //     return (
  //       <BButtons
  //         rowId={row.id}
  //         edit={props.enabledEdit}
  //         remove={props.enabledRemove}
  //         buttons={props.otherOperates}
  //         onEdit={edit}
  //         onRemove={handleDelete}
  //       ></BButtons>
  //     );
  //   }
  // });
  return tableColumns;
}

const { columns, columnChecks, data, getData, getDataByPage, loading, pagination, searchParams, resetSearchParams } =
  useContiNewTable({
    apiFn: props.apiFn,
    showTotal: props.showTotal,
    apiParams: props.apiParams,
    columns: columnsTransformer
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
} = useTableOperate(data, getData);

function edit(id: number | string) {
  handleEdit(id);
  onDeleted();
}

function handleDelete(id: string | number) {
  emit('delete', id);
  onDeleted();
}

function handleBatchDelete() {
  emit('batchDelete', checkedRowKeys.value);
  onBatchDeleted();
}

// defineExpose({
//   getData,
//   operateType,
//   columnChecks,
//   resetSearchParams
// });

function handleExport() {
  // tableRef.value?.downloadCsv({ fileName: props.title, keepOriginalData: false });
  // exportExcel();
  onExported();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch flex-auto gap-6px overflow-hidden lt-sm:overflow-auto">
    <TableSearch :model="searchParams" @reset="resetSearchParams" @search="getData">
      <slot name="search" :search-params="searchParams"></slot>
      <NFormItem span="24 s:12 m:6" label="表名" path="tableName" class="pr-24px">
        <NInput v-model:value="searchParams.tableName" placeholder="请输入表名" allow-clear />
      </NFormItem>
    </TableSearch>

    <NCard :title="tabTitle" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <slot name="operations" :checked-row-keys="checkedRowKeys"></slot>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :item-align="itemAlign"
          :export-operation="exportOperation"
          :delete-operation="deleteOperation"
          :add-operation="addOperation"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        ></TableHeaderOperation>
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
