<script setup lang="tsx">
import { NA, NTag } from 'naive-ui';
import { listLog } from '@/apis/monitor/log';
import type { LogQuery } from '@/apis/monitor/type';
import BStatusTag from '@/components/advanced/e-status-tag.vue';
import LogDetailDrawer from './modules/log-detail-drawer.vue';

const apiParams: Api.Common.EPaginatingSearchParams<LogQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  description: null,
  module: null,
  ip: null,
  createUserString: null,
  createTime: null,
  status: null
};
const columns = ref<NaiveUI.TableColumn<any>[]>([
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    fixed: 'left',
    resizable: true,
    ellipsis: { tooltip: true },
    render(row) {
      return h(NA, { size: 'small', onClick: () => handleOnClick(row.id) }, { default: () => row.id });
    }
  },
  { key: 'createUserString', title: '用户昵称', align: 'center', resizable: true },
  { key: 'description', title: '行为', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    resizable: true,
    render: row => {
      return h(BStatusTag, { value: row.status, bordered: false }, { default: () => row.status });
    }
  },
  { key: 'ip', title: 'IP', align: 'center', resizable: true },
  { key: 'address', title: '地点', align: 'center', resizable: true },
  {
    key: 'timeTaken',
    title: '耗时',
    align: 'center',
    resizable: true,
    render: row => {
      return h(
        NTag,
        {
          value: row.status,
          bordered: false,
          size: 'small',
          class: 'w-50px justify-center',
          type: row.timeTaken > 1000 ? 'error' : row.timeTaken > 200 ? 'warning' : 'success'
        },
        { default: () => `${row.timeTaken} ms` }
      );
    }
  },
  { key: 'browser', title: '浏览器', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { key: 'os', title: '终端系统', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { key: 'createTime', title: '操作时间', align: 'center', resizable: true, ellipsis: { tooltip: true } }
]);

const tableRef = ref();
const detailRef = ref();

const visible = ref<boolean>(false);
const rowId = ref<string>('');

function handleOnClick(id: string) {
  rowId.value = id;
  visible.value = true;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="tableName"
      :api-fn="listLog"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :header-operations="['export', 'refresh', 'height', 'columnSetting']"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="用户" path="createUserString">
          <NInput v-model:value="searchParams.createUserString" placeholder="请输入用户昵称" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="日志类型" path="module">
          <NSelect
            v-model:value="searchParams.module"
            placeholder="请选择日志类型"
            :options="[
              { label: '登录/退出', value: '登录' },
              { label: '操作日志', value: undefined }
            ]"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="IP/地点" path="ip">
          <NInput v-model:value="searchParams.ip" placeholder="请输入用户 IP 或地点" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="时间" path="createTime">
          <NDatePicker
            v-model:formatted-value="searchParams.createTime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
    <LogDetailDrawer ref="detailRef" v-model:visible="visible" :row-id="rowId" />
  </div>
</template>

<style scoped></style>
