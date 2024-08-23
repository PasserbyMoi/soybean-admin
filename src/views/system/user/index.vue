<script setup lang="tsx">
import type { UserQuery, UserResp } from '@/apis';
import { deleteUser, listUser } from '@/apis';
import { $t } from '@/locales';
import { enableNextOptions } from '@/constants/common';
import GenderTag from '@/components/custom/gender-tag.vue';
import EnableTag from '@/components/custom/enable-tag.vue';
import BoolTag from '@/components/custom/bool-tag.vue';
import GenderAvatar from '@/components/custom/gender-avatar.vue';
import Tags from '@/components/custom/tags.vue';
import type { TableColumn } from '@/hooks/common/table';
import UserRestpwdModal from './modules/user-restpwd-modal.vue';
import UserViewDrawer from './modules/user-view-drawer.vue';
import UserDetailDrawer from './modules/user-detail-drawer.vue';
import UserImportDrawer from './modules/user-import-drawer.vue';
import DictTreeCard from './modules/dept-tree-card.vue';

defineOptions({ name: 'SystemStorage' });

const apiParams: Api.Common.EPaginatingSearchParams<UserQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  description: null,
  status: null
};
const columns = ref<TableColumn<any>[]>([
  {
    title: '用户名',
    key: 'username',
    align: 'left',
    titleAlign: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    fixed: 'left',
    render(row) {
      return h(GenderAvatar, { name: row.username, gender: row.gender, onClick: () => viewHandle(row.id) });
    }
  },
  {
    title: '昵称',
    key: 'nickname',
    align: 'left',
    titleAlign: 'center',
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    render: row => {
      return h(EnableTag, { value: row.status });
    }
  },
  {
    title: '性别',
    key: 'gender',
    align: 'center',
    render: row => {
      return h(GenderTag, { value: row.gender });
    }
  },
  { title: '所属部门', key: 'deptName', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '角色',
    key: 'roleNames',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    render: row => {
      return h(Tags, { values: row.roleNames });
    }
  },
  { title: '手机号', key: 'phone', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '邮箱', key: 'email', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '系统内置',
    key: 'isSystem',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    render: row => {
      return h(BoolTag, { value: row.isSystem });
    }
  },
  { title: '描述', key: 'description', align: 'center', resizable: true, ellipsis: { tooltip: true }, hide: true },
  {
    title: '创建人',
    key: 'createUserString',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  },
  { title: '创建时间', key: 'createTime', align: 'center', resizable: true, ellipsis: { tooltip: true }, hide: true },
  {
    title: '修改人',
    key: 'updateUserString',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  },
  { title: '修改时间', key: 'updateTime', align: 'center', resizable: true, ellipsis: { tooltip: true }, hide: true }
]);

const operations: App.Table.Operation<UserResp>[] = [
  {
    label: $t('common.edit'),
    yesHandle(row, _index) {
      if (row.id) editHandle(row.id);
    }
  },
  {
    label: $t('common.delete'),
    type: 'error',
    confirm: true,
    disabled: row => row.isSystem ?? false,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  },
  {
    label: $t('common.modifyPassword'),
    type: 'default',
    yesHandle(row, _index) {
      if (row.id) resetPwdHandle(row.id);
    }
  }
];

const tableRef = ref();
const importRef = ref();
const detailRef = ref();
const viewRef = ref();

const rowId = ref<string>();
const visible = ref<boolean>();
const visibleImport = ref<boolean>();
const visibleView = ref<boolean>();
const visibleRepwd = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function importHandle() {
  visibleImport.value = true;
  operateType.value = 'add';
}

function addHandle() {
  rowId.value = undefined;
  visible.value = true;
  operateType.value = 'add';
}

function editHandle(id: string) {
  rowId.value = `${id}`;
  visible.value = true;
  operateType.value = 'edit';
}

function viewHandle(id: string) {
  rowId.value = `${id}`;
  visibleView.value = true;
}

function resetPwdHandle(id: string) {
  rowId.value = `${id}`;
  visibleRepwd.value = true;
}

function deleteHandle(id: string) {
  deleteUser(id)
    .then(() => {
      window.$message?.info($t('common.deleteSuccess'));
      submited();
    })
    .catch(err => {
      window.$message?.info(err);
    });
}

function submited() {
  tableRef.value.getDataByPage();
}

// 根据选中部门查询
const handleSelectDept = (key: string) => {
  tableRef.value.searchParams.deptId = key;
  tableRef.value.getDataByPage();
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard ref="tableRef" row-key="id" :api-fn="listUser" :api-params="apiParams" :columns="columns"
      :show-selection="false" :scroll-x="1000" :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'stripe', 'columnSetting']" @add="addHandle"
      @edit="editHandle" @delete="deleteHandle">
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="标题" path="description">
          <NInput v-model:value="searchParams.description" placeholder="请输入关键词" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="类型" path="status">
          <NSelect v-model:value="searchParams.status" :options="enableNextOptions" placeholder="请选择状态" clearable />
        </NFormItemGi>
      </template>
      <template #sider>
        <DictTreeCard placeholder="请输入关键词" @switch="handleSelectDept" />
      </template>
      <template #operations>
        <NButton size="small" ghost type="error" @click="importHandle">
          <template #icon>
            <icon-mdi:upload class="text-icon" />
          </template>
          {{ $t('common.import') }}
        </NButton>
      </template>
    </TableCard>
    <UserRestpwdModal ref="detailRef" v-model:visible="visibleRepwd" v-model:row-id="rowId" @submitted="submited" />
    <UserImportDrawer ref="importRef" v-model:visible="visibleImport" @submitted="submited" />
    <UserDetailDrawer ref="detailRef" v-model:visible="visible" v-model:row-id="rowId" :operate-type="operateType"
      @submitted="submited" />
    <UserViewDrawer ref="viewRef" v-model:visible="visibleView" v-model:row-id="rowId" :operate-type="operateType"
      @submitted="submited" />
  </div>
</template>

<style scoped></style>
