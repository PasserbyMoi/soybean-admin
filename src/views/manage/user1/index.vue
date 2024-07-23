<script setup lang="tsx">
import type { VNodeChild } from 'vue';
import { NSwitch, NTag } from 'naive-ui';
import { fetchGetUserList } from '@/service/api';
import { $t } from '@/locales';
import { enableStatusOptions, userGenderOptions, userGenderRecord } from '@/constants/business';
import type { TableDataWithIndex } from '~/packages/hooks/src';
import TableColumnEdit from '@/components/advanced/table-column-edit.vue';
import UserSearch from './modules/user-search.vue';
import UserOperateDrawer from './modules/user-operate-drawer.vue';

// const renderAll = (rowData: TableDataWithIndex<Api.SystemManage.User>, rowIndex: number): VNodeChild => {
const renderAll = (value: any, rowData: TableDataWithIndex<Api.SystemManage.User>, rowIndex: number): VNodeChild => {
  if (value === null) {
    return null;
  }
  return <TableColumnEdit mvalue={value} formType="input"></TableColumnEdit>;
};

const renderTag = (rowData: TableDataWithIndex<Api.SystemManage.User>, rowIndex: number): VNodeChild => {
  if (rowData.userGender === null) {
    return null;
  }
  const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
    '0': 'primary',
    '1': 'success',
    '2': 'error'
  };
  const label = $t(userGenderRecord[rowData.userGender]);
  return <NTag type={tagMap[rowData.userGender]}>{label}</NTag>;
};

const renderSwitch = (rowData: TableDataWithIndex<Api.SystemManage.User>, rowIndex: number): VNodeChild => {
  if (rowData.status === null) {
    return null;
  }
  return <NSwitch v-model:value={rowData.status} checked-value="1" unchecked-value="0" size="small" />;
};

const apiParams = ref({
  current: 1,
  size: 10,
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
});
const columns = ref<NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<Api.SystemManage.User>>[]>([
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
  {
    key: 'userName',
    title: $t('page.manage.user.userName'),
    align: 'center',
    sorter: 'default'
  },
  {
    key: 'userGender',
    title: $t('page.manage.user.userGender'),
    align: 'center',
    width: 100,
    defaultFilterOptionValues: [],
    filterOptions: userGenderOptions,
    filter(value, row) {
      return row.userGender === value;
    },
    render: (row, index) => {
      if (row.userGender === null) {
        return null;
      }
      // const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
      //   '0': 'primary',
      //   '1': 'success',
      //   '2': 'error'
      // };
      const label = $t(userGenderRecord[row.userGender]);
      return <TableColumnEdit mvalue={label} formType="select" options={userGenderOptions}></TableColumnEdit>;
    }
  },
  {
    key: 'nickName',
    title: $t('page.manage.user.nickName'),
    align: 'center',
    render: (row, index) => {
      return <TableColumnEdit mvalue={row.nickName}></TableColumnEdit>;
    }
  },
  {
    key: 'userPhone',
    title: $t('page.manage.user.userPhone'),
    align: 'center',
    render: (row, index) => {
      return <TableColumnEdit mvalue={row.userPhone}></TableColumnEdit>;
    }
  },
  {
    key: 'userEmail',
    title: $t('page.manage.user.userEmail'),
    align: 'center',
    render: (row, index) => {
      return <TableColumnEdit mvalue={row.userEmail}></TableColumnEdit>;
    }
  },
  {
    key: 'status',
    title: $t('page.manage.user.userStatus'),
    align: 'center',
    width: 120,
    filterOptions: enableStatusOptions,
    filter(value, row) {
      return row.status === value;
    },
    render: renderSwitch
  }
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard :title="$t('page.manage.user.title')" :show-total="true" :api-fn="fetchGetUserList"
      :api-params="apiParams" :columns="columns">
      <template #search="{ param, reset, refresh }">
        <UserSearch :model="param" @reset="reset" @search="refresh" @submitted="refresh" />
      </template>

      <template #drawer="{ visible, type, data, submitted }">
        <UserOperateDrawer :visible="visible" :operate-type="type" :row-data="data" @submitted="submitted" />
      </template>
    </TableCard>
  </div>
</template>

<style scoped></style>
