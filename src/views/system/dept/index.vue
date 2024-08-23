<script setup lang="tsx">
import { type DeptQuery, type DeptResp, deleteDept, listDept } from '@/apis';
import EnableTag from '@/components/custom/enable-tag.vue';
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';
import BoolTag from '@/components/custom/bool-tag.vue';
import type { TableColumn } from '@/hooks/common/table';
import DeptDetailModal from './modules/dept-detail-modal.vue';

defineOptions({ name: 'SystemDept' });

const apiParams: DeptQuery = {
  description: null,
  status: null
};
const columns = ref<TableColumn<any>[]>([
  {
    title: '名称',
    key: 'name',
    align: 'left',
    minWidth: 260,
    titleAlign: 'center',
    fixed: 'left',
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
    align: 'center',
    render: row => {
      return h(EnableTag, { value: row.status });
    }
  },
  {
    title: '系统内置',
    key: 'isSystem',
    minWidth: 80,
    align: 'center',
    render: row => {
      return h(BoolTag, { value: row.isSystem });
    }
  },
  { title: '排序', key: 'sort', minWidth: 80, align: 'center', ellipsis: { tooltip: true } },
  { title: '描述', key: 'description', align: 'center', maxWidth: 160, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createUserString', align: 'center', maxWidth: 100, ellipsis: { tooltip: true }, hide: true },
  { title: '创建时间', key: 'createTime', align: 'center', maxWidth: 160, ellipsis: { tooltip: true }, hide: true },
  { title: '修改人', key: 'updateUserString', align: 'center', maxWidth: 100, ellipsis: { tooltip: true }, hide: true },
  { title: '修改时间', key: 'updateTime', align: 'center', maxWidth: 160, ellipsis: { tooltip: true }, hide: true }
]);

const operations: App.Table.Operation<DeptResp>[] = [
  {
    label: $t('common.edit'),
    yesHandle(row, _index) {
      if (row.id) editHandle(row.id);
    }
  },
  {
    label: $t('common.add'),
    type: 'success',
    yesHandle(row, _index) {
      if (row.id) addHandle(row.id);
    }
  },
  {
    label: $t('common.delete'),
    type: 'error',
    confirm: true,
    disabled: (row: DeptResp) => row.isSystem ?? true,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];

const tableRef = ref();
const detailRef = ref();

const rowId = ref<string | number>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function addHandle(id?: string | number) {
  if (id) {
    rowId.value = id;
  } else {
    rowId.value = undefined;
  }
  visible.value = true;
  operateType.value = 'add';
}

function editHandle(id: string | number) {
  rowId.value = `${id}`;
  visible.value = true;
  operateType.value = 'edit';
}

function deleteHandle(id: string | number) {
  deleteDept(id)
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
      :api-fn="listDept"
      :api-params="apiParams"
      :columns="columns"
      :show-index="false"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="关键词" path="description">
          <NInput v-model:value="searchParams.description" placeholder="请输入关键词" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="状态" path="status">
          <NSelect
            v-model:value="searchParams.status"
            :options="enableStatusOptions"
            placeholder="请选择状态"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
    <DeptDetailModal
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
