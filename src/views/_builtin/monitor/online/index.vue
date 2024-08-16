<script setup lang="tsx">
import { kickout, listOnlineUser } from '@/apis/monitor/online';
import { useAuthStore } from '@/store/modules/auth';
import type { OnlineUserQuery, OnlineUserResp } from '@/apis/monitor/type';
import { $t } from '@/locales';

const userStore = useAuthStore();

const apiParams: Api.Common.EPaginatingSearchParams<OnlineUserQuery> = {
  page: 1,
  size: 10,
  nickname: null,
  loginTime: null,
  sort: ['createTime, desc']
};
const columns = ref<NaiveUI.TableColumn<any>[]>([
  {
    key: 'nickname',
    title: '用户昵称',
    align: 'center',
    fixed: 'left',
    width: 180,
    ellipsis: {
      tooltip: true
    },
    render: row => {
      return `${row.nickname}（${row.username}）`;
    }
  },
  {
    key: 'ip',
    title: '登录 IP',
    align: 'center',
    width: 180,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'address',
    title: '登录地点',
    align: 'center',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'browser',
    title: '浏览器',
    align: 'center',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'os',
    title: '终端系统',
    align: 'center',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'loginTime',
    title: '登录时间',
    align: 'center',
    width: 180,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'lastActiveTime',
    title: '最后活跃时间',
    align: 'center',
    width: 180,
    ellipsis: {
      tooltip: true
    }
  }
]);

const tableRef = ref();

const operations: App.Table.Operation<OnlineUserResp>[] = [
  {
    label: $t('common.forcedLogout'),
    confirm: true,
    disabled: (row: OnlineUserResp) => userStore.token === row.token,
    yesHandle: (row: OnlineUserResp) => {
      kickout(row.token).then(() => {
        tableRef.value.getData();
        window.$message?.success('强退成功');
      });
    }
  }
];
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="tableName"
      :api-fn="listOnlineUser"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['refresh', 'height', 'stripe', 'columnSetting']"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="用户" path="nickname" class="pr-24px">
          <NInput v-model:value="searchParams.nickname" placeholder="请输入用户昵称" allow-clear />
        </NFormItemGi>
        <NFormItemGi span="24 s:18 m:6" label="时间" path="createTime" class="pr-24px">
          <NDatePicker
            v-model:formatted-value="searchParams.loginTime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
  </div>
</template>

<style scoped></style>
