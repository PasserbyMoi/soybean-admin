<script setup lang="tsx">
import type { DataTableInst } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTabStore } from '@/store/modules/tab';
import { useCommonTable } from '@/hooks/common/table';
import { tableIndexColumns, tableSelectionColumns } from '@/constants/business';
import TableColumnOperations from './table-column-operations.vue';
import TableHeaderOperation from './table-header-operation.vue';

defineOptions({
  name: 'TableCard'
});

const appStore = useAppStore();
const tabStore = useTabStore();

interface Props {
  rowKey?: string;
  title?: string;
  showTotal?: boolean;
  showSelection?: boolean;
  showIndex?: boolean;
  apiFn: NaiveUI.TableApiFn;
  apiParams: Api.Common.PaginatingSearchParams | any;
  columns: NaiveUI.TableColumn<any>[];

  loading?: boolean;
  itemAlign?: NaiveUI.Align;
}
const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  title: '数据展示',
  showSelection: true,
  showIndex: true,
  showTotal: true,
  loading: false,
  itemAlign: 'flex-end'
});

interface Emits {
  (e: 'add'): void;
  (e: 'batchDelete', ids: string[] | number[]): void;
}
const emit = defineEmits<Emits>();

const headerOperations = defineModel<Array<UnionKey.TableHeaderOperation<any>>>('headerOperations', {
  default: () => ['add', 'delete', 'export', 'refresh', 'height', 'columnSetting']
});

const columnOperations = defineModel<Array<UnionKey.TableColumnOperation<any>>>('columnsOperations', {
  default: () => []
});

const tabTitle = ref<string>(props.title ?? tabStore.getActiveTab().label ?? tabStore.getActiveTab().newLabel);
const tableRef = ref<DataTableInst>();
const searchVisible = ref(true);
const tableHeaderOperatioRef = ref<any>();
const checkedRowKeys = ref<string[] | number[]>([]);

function columnsTransformer(): NaiveUI.TableColumn<any>[] {
  let tableColumns: NaiveUI.TableColumn<any>[] = [];
  if (props.showSelection) {
    tableColumns.push(tableSelectionColumns);
  }
  if (props.showIndex) {
    tableColumns.push(tableIndexColumns);
  }
  tableColumns = tableColumns.concat(props.columns);

  if (!columnOperations.value || columnOperations.value.length === 0) {
    return tableColumns;
  }

  tableColumns.push({
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 180,
    resizable: true,
    fixed: 'right',
    render: row => {
      return h(TableColumnOperations, { row, operations: columnOperations.value });
    }
  });
  return tableColumns;
}

const { columns, columnChecks, data, getData, getDataByPage, loading, pagination, searchParams, resetSearchParams } =
  useCommonTable({
    apiFn: props.apiFn,
    showTotal: props.showTotal,
    apiParams: props.apiParams,
    columns: columnsTransformer
  });

function handleAdd() {
  emit('add');
}

function handleBatchDelete() {
  emit('batchDelete', checkedRowKeys.value);
  window.$message?.success($t('common.deleteSuccess'));
  checkedRowKeys.value = [];
  getData();
}

function handleExport() {
  tableRef.value?.downloadCsv({ fileName: props.title, keepOriginalData: false });
  window.$message?.success($t('common.exportSuccess'));
}

defineExpose({
  getDataByPage
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch flex-auto gap-6px overflow-hidden lt-sm:overflow-auto">
    <NCard v-if="searchVisible" :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
      <NForm v-model:mode="searchParams" label-placement="left" :label-width="80">
        <NGrid responsive="screen" item-responsive :x-gap="10">
          <slot name="search" :search-params="searchParams"></slot>
          <slot name="default">
            <NFormItemGi>
              <NSpace class="ml-6px" :wrap="false">
                <NButton @click="resetSearchParams">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="getData">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </slot>
        </NGrid>
      </NForm>
    </NCard>

    <NCard :title="tabTitle" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <NSpace :align="itemAlign" wrap class="items-center justify-center lt-sm:w-200px">
          <slot name="operations"></slot>
          <TableHeaderOperation
            ref="tableHeaderOperatioRef"
            v-model:columns="columnChecks"
            v-model:operations="headerOperations"
            :loading="loading"
            :item-align="itemAlign"
            :search-visible="searchVisible"
            :delete-disabled="columnChecks.length === 0"
            @add="handleAdd"
            @batch-delete="handleBatchDelete"
            @export="handleExport"
            @refresh="getDataByPage"
          />
        </NSpace>
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
        :scroll-x="1200"
        class="sm:h-full"
        remote
      />
    </NCard>
  </div>
</template>

<style scoped></style>
