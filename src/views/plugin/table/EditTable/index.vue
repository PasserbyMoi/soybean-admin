<script setup lang="tsx">
import { fetchGetUserList } from '@/service/api';
import { $t } from '@/locales';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import BSelect from '@/components/advanced/b-select.vue';
import BInput from '@/components/advanced/b-input.vue';
import BSwitch from '@/components/advanced/b-switch.vue';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const update = (newValue: string | number | boolean): boolean => {
  console.log(newValue);
  return true;
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
    key: 'userName',
    title: $t('page.manage.user.userName'),
    align: 'center',
    sorter: 'default'
  },
  {
    key: 'userGender',
    title: $t('page.manage.user.userGender'),
    align: 'center',
    defaultFilterOptionValues: [],
    filterOptions: userGenderOptions,
    filter(value, row) {
      return row.userGender === value;
    },
    render: (row, index) => {
      return <BSelect mvalue={row.userGender} options={userGenderOptions}></BSelect>;
    }
  },
  {
    key: 'nickName',
    title: $t('page.manage.user.nickName'),
    align: 'center',
    render: (row, index) => {
      return <BInput mvalue={row.nickName}></BInput>;
    }
  },
  {
    key: 'userPhone',
    title: $t('page.manage.user.userPhone'),
    align: 'center',
    render: (row, index) => {
      return <BInput mvalue={row.userPhone}></BInput>;
    }
  },
  {
    key: 'userEmail',
    title: $t('page.manage.user.userEmail'),
    align: 'center',
    render: (row, index) => {
      return <BInput mvalue={row.userEmail}></BInput>;
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
    render: (row, index) => {
      return <BSwitch mvalue={row.status} onOnUpdated={update} />;
    }
  }
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      :title="$t('page.manage.user.title')"
      :show-total="true"
      :api-fn="fetchGetUserList"
      :api-params="apiParams"
      :columns="columns"
    >
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
