<script setup lang="tsx">
import { listGenerator } from '@/apis/tool/generator';
import type { TableQuery } from '@/apis/tool/type';
import UserOperateDrawer from './modules/generator-operate-drawer.vue';
import UserSearch from './modules/generator-search.vue';

const apiParams = ref<Api.Common.EPaginatingSearchParams<TableQuery>>({
  page: 1,
  size: 10,
  tableName: undefined
});
const columns = ref<NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<any>>[]>([
  {
    key: 'tableName',
    title: '表名称',
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'comment',
    title: '描述',
    align: 'center'
  },
  {
    key: 'engine',
    title: '存储引擎',
    align: 'center'
  },
  {
    key: 'charset',
    title: '字符集',
    align: 'center'
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center'
  }
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableEcard
      :show-total="true"
      :show-selection="true"
      :show-index="true"
      :api-params="apiParams"
      :columns="columns"
      :api-fn="listGenerator"
      row-key="tableName"
    >
      <template #search="{ param, reset, refresh }">
        <UserSearch :model="param" @reset="reset" @search="refresh" @submitted="refresh" />
      </template>
      <template #drawer="{ visible, type, data, submitted }">
        <UserOperateDrawer :visible="visible" :operate-type="type" :row-data="data" @submitted="submitted" />
      </template>
    </TableEcard>
  </div>
</template>

<style scoped></style>
