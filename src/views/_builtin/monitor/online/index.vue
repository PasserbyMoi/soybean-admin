<script setup lang="tsx">
import { listOnlineUser } from '@/apis/monitor/online';
import type { OnlineUserQuery } from '@/apis/monitor/type';
import OnlineSearch from './modules/online-search.vue';

const apiParams = ref<Api.Common.EPaginatingSearchParams<OnlineUserQuery>>({
  page: 1,
  size: 10,
  nickname: undefined,
  loginTime: undefined
  // sort: ['createTime, desc']
});
const columns = ref<NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<any>>[]>([
  {
    key: 'nickname',
    title: '用户昵称',
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'ip',
    title: '登录 IP',
    align: 'center'
  },
  {
    key: 'address',
    title: '登录地点',
    align: 'center'
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
  },
  {
    key: 'loginTime',
    title: '登录时间',
    align: 'center'
  },
  {
    key: 'lastActiveTime',
    title: '最后活跃时间',
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
      :api-fn="listOnlineUser"
    >
      <template #search="{ param, reset, refresh }">
        <OnlineSearch :model="param" @reset="reset" @search="refresh" @submitted="refresh" />
      </template>
    </TableEcard>
  </div>
</template>

<style scoped></style>
