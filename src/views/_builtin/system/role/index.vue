<script setup lang="tsx">
import { NA } from 'naive-ui';
import type { RoleQuery, RoleResp } from '@/apis';
import { deleteRole, listRole } from '@/apis';
import BoolTag from '@/components/custom/bool-tag.vue';
import TableTag from '@/components/advanced/table-tag.vue';
import { $t } from '@/locales';
import { useDict } from '@/hooks/business/dict';
import type { TableColumn } from '@/hooks/common/table';
import RoleViewDrawer from './modules/role-view-drawer.vue';
import RoleDetailDrawer from './modules/role-detail-drawer.vue';

defineOptions({ name: 'SystemRole' });

const { data_scope_enum } = useDict('data_scope_enum');

const apiParams: Api.Common.EPaginatingSearchParams<RoleQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  description: null
};
const columns = ref<TableColumn<any>[]>([
  {
    title: '名称',
    key: 'name',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    render(row) {
      return h(NA, { size: 'small', onClick: () => viewHandle(row.id) }, { default: () => row.name });
    }
  },
  { title: '编码', key: 'code', width: '180px', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '数据权限',
    key: 'dataScope',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    render: row => {
      return h(TableTag, { value: row.dataScope, options: data_scope_enum.value }, { default: () => row.dataScope });
    }
  },
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
  { title: '排序', key: 'sort', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '描述', key: 'description', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '创建人',
    key: 'createUserString',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改人',
    key: 'updateUserString',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改时间',
    key: 'updateTime',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    hide: true
  }
]);

const operations: App.Table.Operation<RoleResp>[] = [
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
    disabled: row => row.isSystem,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];

const tableRef = ref();
const detailRef = ref();
const viewRef = ref();

const rowId = ref<string>();
const visible = ref<boolean>();
const visibleView = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

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

function deleteHandle(id: string) {
  deleteRole(id)
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
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="id"
      :api-fn="listRole"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'stripe', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="关键词" path="description">
          <NInput v-model:value="searchParams.description" placeholder="请输入关键词" clearable />
        </NFormItemGi>
      </template>
    </TableCard>

    <RoleDetailDrawer
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />

    <RoleViewDrawer
      ref="viewRef"
      v-model:visible="visibleView"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
