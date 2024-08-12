<script setup lang="tsx">
import { listGenerator } from '@/apis/tool/generator';
import type { TableQuery, TableResp } from '@/apis/tool/type';
import type { TableColumn } from '@/hooks/common/table';
import GeneratorConfigDrawer from './modules/generator-config-drawer.vue';
import GeneratorViewModal from './modules/generator-view-modal.vue';

defineOptions({
  name: 'SystemGenerator'
});

const apiParams: Api.Common.EPaginatingSearchParams<TableQuery> = {
  page: 1,
  size: 10,
  tableName: null
};
const columns = ref<TableColumn<any>[]>([
  { key: 'tableName', title: '表名称', align: 'center', fixed: 'left' },
  { key: 'comment', title: '描述', align: 'center' },
  { key: 'engine', title: '存储引擎', align: 'center' },
  { key: 'charset', title: '字符集', align: 'center' },
  { key: 'createTime', title: '创建时间', align: 'center' }
]);

const operations: App.Table.Operation<TableResp>[] = [
  {
    label: '配置',
    yesHandle: (_row: TableResp) => {
      configHandle(_row.tableName);
    }
  },
  {
    label: '生成',
    disabled: (row: TableResp) => row.disabled,
    yesHandle: (_row: TableResp) => {
      viewHandle(_row.tableName);
    }
  }
];

const tableRef = ref();
const configRef = ref();
const viewRef = ref();

const rowId = ref<string>();
const configVisible = ref<boolean>();
const viewVisible = ref<boolean>();

function configHandle(id: string) {
  rowId.value = id;
  configVisible.value = true;
}

function viewHandle(id: string) {
  rowId.value = id;
  viewVisible.value = true;
}

function submited() {
  tableRef.value.getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="tableName"
      :api-params="apiParams"
      :columns="columns"
      :api-fn="listGenerator"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['export', 'refresh', 'height', 'stripe', 'columnSetting']"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:6" label="表名" path="tableName" class="pr-24px">
          <NInput v-model:value="searchParams.tableName" placeholder="请输入表名" allow-clear />
        </NFormItemGi>
      </template>
    </TableCard>
    <GeneratorConfigDrawer
      ref="configRef"
      v-model:visible="configVisible"
      v-model:row-id="rowId"
      @submitted="submited"
    />

    <GeneratorViewModal ref="viewRef" v-model:visible="viewVisible" v-model:row-id="rowId" @submitted="submited" />
  </div>
</template>

<style scoped></style>
