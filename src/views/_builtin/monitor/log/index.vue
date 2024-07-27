<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { listLog } from '@/apis/monitor/log';
import type { LogQuery } from '@/apis/monitor/type';
import BStatusTag from '@/components/advanced/b-status-tag.vue';
import LogSearch from './modules/log-search.vue';

const apiParams = ref<Api.Common.EPaginatingSearchParams<LogQuery>>({
  page: 1,
  size: 10,
  description: undefined,
  module: undefined,
  ip: undefined,
  createUserString: undefined,
  createTime: undefined,
  status: undefined,
  sort: undefined
});
const columns = ref<NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<any>>[]>([
  {
    key: 'createTime',
    title: '时间',
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'createUserString',
    title: '用户昵称',
    align: 'center'
  },
  {
    key: 'description',
    title: '行为',
    align: 'center'
  },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    render: row => {
      return <BStatusTag value={row.status} bordered={false}></BStatusTag>;
    }
  },
  {
    key: 'ip',
    title: 'IP',
    align: 'center'
  },
  {
    key: 'address',
    title: '地点',
    align: 'center'
  },
  {
    key: 'timeTaken',
    title: '耗时',
    align: 'center',
    render: row => {
      return (
        <NTag
          bordered={false}
          size={'small'}
          class={'w-50px justify-center'}
          type={row.timeTaken > 1000 ? 'error' : row.timeTaken > 200 ? 'warning' : 'success'}
        >
          {row.timeTaken} ms
        </NTag>
      );
    }
  },
  {
    key: 'browser',
    title: '浏览器',
    align: 'center'
  },
  {
    key: 'os',
    title: '终端系统',
    align: 'center'
  }
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableEcard
      :show-total="true"
      :show-selection="false"
      :show-index="true"
      :enabled-add="false"
      :enabled-edit="false"
      :enabled-remove="false"
      :enabled-export="false"
      :api-params="apiParams"
      :columns="columns"
      :api-fn="listLog"
    >
      <template #search="{ param, reset, refresh }">
        <LogSearch :model="param" @reset="reset" @search="refresh" @submitted="refresh" />
      </template>
    </TableEcard>
  </div>
</template>

<style scoped></style>
